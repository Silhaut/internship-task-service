import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../users/users.service';
import { TestService } from './test.service';
import { QuestionsService } from '../questions/questions.service';
import { TestAnswersService } from '../test-answers/test-answers.service';
import { ProfessionsService } from '../professions/professions.service';
import { TestResultsService } from '../test-results/test-results.service';
import { CreateTestResultDto } from '../data/dto/create-test-result.dto';
import { CreateTestAnswerDto } from '../data/dto/create-test-answer.dto';

interface MyContext extends Context {
  session: {
    testId?: string;
    currentQuestionIndex?: number;
    questions?: {
      id: string;
      text: string;
      options: { id: string; text: string }[];
    }[];
  };
}

@Update()
export class TestUpdate {
  constructor(
    private usersService: UsersService,
    private testsService: TestService,
    private questionService: QuestionsService,
    private testAnswersService: TestAnswersService,
    private professionsService: ProfessionsService,
    private testResultsService: TestResultsService,
  ) {
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

  @Command('stats')
  async onStatsCommand(@Ctx() ctx: MyContext) {
    await this.onStats(ctx);
  }

  private async startTest(ctx: MyContext) {
    const tgId = String(ctx.from?.id);
    const user = await this.usersService.findByTelegramId(tgId);
    if (!user) {
      await ctx.reply('Сначала зарегистрируйся через /start 📱');
      return;
    }

    await ctx.reply('Тест начинается! 🧠');
    const test = await this.testsService.create(user.id);

    const questions = await this.questionService.findMany();
    if (!questions.length) {
      await ctx.reply('❗ Вопросы ещё не добавлены администратором.');
      return;
    }

    ctx.session.testId = test.id;
    ctx.session.currentQuestionIndex = 0;
    ctx.session.questions = questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.answerOptions.map((o) => ({ id: o.id, text: o.text })),
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
        inline_keyboard: q.options.map((o) => [
          { text: o.text, callback_data: `answer_${o.id}` },
        ]),
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

    const testAnswer: CreateTestAnswerDto = {
      testId: ctx.session.testId!,
      questionId: question.id,
      answerId,
    };

    await this.testAnswersService.create(testAnswer);

    ctx.session.currentQuestionIndex = idx + 1;
    await ctx.answerCbQuery('✅ Ответ принят!');
    await this.sendNextQuestion(ctx);
  }

  @Action('my_stats')
  async onStats(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();

    const tgId = String(ctx.from?.id);
    const user = await this.usersService.findByTelegramIdWithTestsAndResults(tgId);

    if (!user || user.tests.length === 0) {
      await ctx.reply('Пока нет данных о пройденных тестах 🕐');
      return;
    }

    let message = '📊 *История твоих тестов:*\n\n';

    for (const [i, t] of user.tests.entries()) {
      const date = new Date(t.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const prof = t.result?.profession?.name ?? '—';
      const score = t.result?.scoreDetails
        ? Object.entries(t.result.scoreDetails)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : 'нет данных';

      message += `🧾 Тест #${i + 1} — ${date}\n📌 Профессия: *${prof}*\n💯 Баллы: ${score}\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private async finishTest(ctx: MyContext) {
    const testId = ctx.session.testId!;
    const rows = await this.testAnswersService.findMany(testId);

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
    const bestProf = await this.professionsService.findByName(bestName);

    const testResults: CreateTestResultDto = {
      testId,
      professionId: bestProf!.id,
      scoreDetails: scores,
    };

    await this.testResultsService.create(testResults);

    await ctx.reply(
      `🎉 Тест завершён!\nТебе больше всего подходит: *${bestName}* (${bestScore} баллов).`,
      { parse_mode: 'Markdown' },
    );

    await ctx.reply('Хочешь посмотреть свою статистику?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Моя статистика', callback_data: 'my_stats' }],
        ],
      },
    });

    ctx.session = {};
  }
}
