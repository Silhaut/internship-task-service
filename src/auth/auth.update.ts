import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { CreateUserDto } from '../data/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'

interface MyContext extends Context {
  session: {
    step?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phone?: string;
  };
}

@Update()
export class AuthUpdate {
  constructor(private usersService: UsersService) {}

  @Start()
  async onStart(@Ctx() ctx: MyContext) {
    console.log('Start Context: ', ctx);

    const tgId = String(ctx.from?.id);

    const user = await this.usersService.findByTelegramId(tgId);

    if (user) {
      await ctx.reply(`👋 С возвращением, ${user.firstName}!`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🧠 Пройти тест', callback_data: 'start_test' },
              { text: '📊 Моя статистика', callback_data: 'my_stats' },
            ],
            // [
            //   { text: 'ℹ️ Помощь', callback_data: 'help' },
            // ],
          ],
        },
      });
      return;
    }

    ctx.session = {};
    ctx.session.step = 'firstName';
    await ctx.reply('👋 Привет! Напиши своё имя:');
  }

  @Hears(/.*/)
  async onMessage(@Ctx() ctx: MyContext) {
    console.log('Hears: ', ctx);
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
        ctx.session.step = 'password';
        await ctx.reply('Введите пароль для будущей аутентификации:');
        break;

      case 'password':
        ctx.session.password = text;
        ctx.session.step = 'phone';
        await ctx.reply('📱 Теперь отправь свой номер телефона', {
          reply_markup: {
            keyboard: [[{ text: 'Отправить контакт', request_contact: true }]],
            one_time_keyboard: true,
          },
        });
        break;

      default:
        await ctx.reply(
          'Я тебя не понял 🤔. Напиши /start чтобы начать заново.',
        );
    }
  }

  @On('contact')
  async onContact(@Ctx() ctx: MyContext) {
    console.log('Contact: ', ctx);
    const userId = ctx.from?.id;
    if (!userId) return;

    const contact = (ctx.message as any)?.contact;
    const phone = contact?.phone_number;
    const username = contact?.first_name

    const { firstName, lastName, password } = ctx.session;

    const hash = await bcrypt.hash(password, 10);

    const user = await this.usersService.findByTelegramId(String(userId));

    const createUser: CreateUserDto = {
      telegramId: String(userId),
      username,
      firstName: firstName ?? 'Не указано',
      lastName: lastName ?? 'Не указано',
      password: hash,
      phone,
      role: 'USER',
    };

    if (!user) {
      await this.usersService.create(createUser);
      await ctx.reply(`✅ Спасибо, ${firstName}! Ты успешно зарегистрирован.`);
    } else {
      await ctx.reply(`👋 С возвращением, ${firstName || user.firstName}!`);
    }

    await ctx.reply('Выбери, что хочешь сделать 👇', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧠 Пройти тест', callback_data: 'start_test' },
            { text: '📊 Статистика', callback_data: 'my_stats' },
          ],
        ],
      },
    });

    ctx.session = {};
  }
}
