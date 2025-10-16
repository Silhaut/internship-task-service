import { Update, Ctx, Action, Hears, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

interface MyContext extends Context {
  session: {
    testId?: string;
    currentQuestionIndex?: number;
    questions?: { id: string; text: string; options: { id: string; text: string }[] }[];
  };
}

@Update()
export class TestUpdate {
  constructor(private prisma: PrismaService) {
    console.log('✅ TestUpdate подключен');
  }

  @Action('start_test')
  async onStartTestAction(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery(); // закрыть "часики"
    await this.startTest(ctx);
  }

  @Command('test')
  async onTestCommand(@Ctx() ctx: MyContext) {
    await this.startTest(ctx);
  }

  private async startTest(ctx: MyContext) {
    const tgId = String(ctx.from?.id);
    const user = await this.prisma.user.findUnique({ where: { telegramId: tgId } });
    if (!user) {
      await ctx.reply('Сначала зарегистрируйся через /start 📱');
      return;
    }

    await ctx.reply('Тест начинается! 🧠');
    const test = await this.prisma.test.create({ data: { userId: user.id } });

    const questions = await this.prisma.question.findMany({
      include: { answerOptions: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!questions.length) {
      await ctx.reply('❗ Вопросы ещё не добавлены администратором.');
      return;
    }

    ctx.session.testId = test.id;
    ctx.session.currentQuestionIndex = 0;
    ctx.session.questions = questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.answerOptions.map(o => ({ id: o.id, text: o.text })),
    }));

    await this.sendNextQuestion(ctx);
  }

  private async sendNextQuestion(ctx: MyContext) {
    const idx = ctx.session.currentQuestionIndex ?? 0;
    const list = ctx.session.questions ?? [];
    if (idx >= list.length) {
      await this.finishTest(ctx);
      return;
    }

    const q = list[idx];
    await ctx.reply(`❓ ${q.text}`, {
      reply_markup: {
        inline_keyboard: q.options.map(o => [{ text: o.text, callback_data: `answer_${o.id}` }]),
      },
    });
  }

  @Action(/answer_.+/)
  async onAnswer(@Ctx() ctx: MyContext) {
    const data = (ctx.callbackQuery as any).data as string;
    const answerId = data.replace('answer_', '');

    const idx = ctx.session.currentQuestionIndex ?? 0;
    const question = ctx.session.questions?.[idx];
    if (!question) {
      await ctx.answerCbQuery('Что-то пошло не так 🤔');
      return;
    }

    await this.prisma.testAnswer.create({
      data: {
        testId: ctx.session.testId!,
        questionId: question.id,
        answerId,
      },
    });

    ctx.session.currentQuestionIndex = idx + 1;
    await ctx.answerCbQuery('✅ Ответ принят!');
    await this.sendNextQuestion(ctx);
  }

  private async finishTest(ctx: MyContext) {
    const testId = ctx.session.testId!;
    const rows = await this.prisma.testAnswer.findMany({
      where: { testId },
      include: { answer: { include: { weights: { include: { profession: true } } } } },
    });

    const scores: Record<string, number> = {};
    for (const r of rows) {
      for (const w of r.answer.weights) {
        scores[w.profession.name] = (scores[w.profession.name] ?? 0) + w.weight;
      }
    }

    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (!top) {
      await ctx.reply('Не удалось посчитать результат 😕');
      return;
    }

    const [bestName, bestScore] = top;
    const bestProf = await this.prisma.profession.findUnique({ where: { name: bestName } });

    await this.prisma.result.create({
      data: { testId, professionId: bestProf!.id, scoreDetails: scores },
    });

    await ctx.reply(
      `🎉 Тест завершён!\nТебе больше всего подходит: *${bestName}* (${bestScore} баллов).`,
      { parse_mode: 'Markdown' },
    );

    ctx.session = {};
  }
}
