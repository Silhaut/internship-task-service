import { Update, Ctx, On, Start, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

interface MyContext extends Context {
  session: {
    step?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

@Update()
export class AuthUpdate {
  constructor(private prisma: PrismaService) {}

  @Start()
  async onStart(@Ctx() ctx: MyContext) {
    ctx.session = {};
    ctx.session.step = 'firstName';
    await ctx.reply('👋 Привет! Напиши своё имя:');
  }

  @Hears(/.*/)
  async onMessage(@Ctx() ctx: MyContext) {
    const text = ctx.message?.['text'];
    if (!text) return;

    switch (ctx.session.step) {
      case 'firstName':
        ctx.session.firstName = text;
        ctx.session.step = 'lastName';
        await ctx.reply('Отлично! Теперь напиши свою фамилию:');
        break;

      case 'lastName':
        ctx.session.lastName = text;
        ctx.session.step = 'phone';
        await ctx.reply('📱 Теперь отправь свой номер телефона', {
          reply_markup: {
            keyboard: [[{ text: 'Отправить контакт', request_contact: true }]],
            one_time_keyboard: true,
          },
        });
        break;

      default:
        await ctx.reply('Я тебя не понял 🤔. Напиши /start чтобы начать заново.');
    }
  }

  @On('contact')
  async onContact(@Ctx() ctx: MyContext) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const contact = (ctx.message as any)?.contact;
    const phone = contact?.phone_number;

    const { firstName, lastName } = ctx.session;

    let user = await this.prisma.user.findUnique({
      where: { telegramId: String(userId) },
    });

    if (!user) {
      await this.prisma.user.create({
        data: {
          telegramId: String(userId),
          firstName: firstName ?? 'Не указано',
          lastName: lastName ?? 'Не указано',
          phone,
          role: 'USER',
        },
      });
      console.log(user)
      await ctx.reply(`✅ Спасибо, ${firstName}! Ты успешно зарегистрирован.`);
    } else {
      await ctx.reply(`👋 С возвращением, ${firstName || user.firstName}!`);
    }

    ctx.session = {};
  }
}
