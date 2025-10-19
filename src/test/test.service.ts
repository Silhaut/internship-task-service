import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MyContext } from '../common/data/dto/my-context.interface';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { TestAnswersService } from '../test-answers/test-answers.service';
import { CreateTestAnswerDto } from '../common/data/dto/create-test-answer.dto';
import { ProfessionsService } from '../professions/professions.service';
import { TestResultsService } from '../test-results/test-results.service';
import { CreateTestResultDto } from '../common/data/dto/create-test-result.dto';
import { paginateAndMap } from '../common/utils/paginate-and-map.util';
import { TestModel } from '../common/data/models/test.model';
import { TestDto, TestWithUserDto } from '../common/data/dto/test.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private testAnswersService: TestAnswersService,
    private professionsService: ProfessionsService,
    private testResultsService: TestResultsService,
  ) {}

  create(userId: string) {
    return this.prisma.test.create({ data: { userId: userId } });
  }

  async startTest(ctx: MyContext) {
    console.log('Start Test');
    const tgId = String(ctx.from?.id);
    const user = await this.usersService.findByTelegramId(tgId);

    if (!user) {
      await ctx.reply('Сначала зарегистрируйся через /start 📱');
      return;
    }

    const test = await this.create(user.id);
    const questions = await this.questionsService.findMany();
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

  async sendNextQuestion(ctx: MyContext) {
    const idx = ctx.session.currentQuestionIndex ?? 0;
    const list = ctx.session.questions ?? [];

    if (!list.length) {
      await ctx.reply('⚠️ Сессия потеряна. Начни тест заново /test');
      return;
    }

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

  async recordAnswer(ctx: MyContext, answerId: string) {
    await ctx.answerCbQuery('✅ Ответ принят!');

    const idx = ctx.session.currentQuestionIndex ?? 0;
    const question = ctx.session.questions?.[idx];
    if (!question) return;

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

  async finishTest(ctx: MyContext) {
    const testId = ctx.session.testId!;
    const rows = await this.testAnswersService.findMany(testId);

    const scores: Record<string, number> = {};
    for (const r of rows) {
      for (const w of r.answer.weights) {
        scores[w.profession.name] = (scores[w.profession.name] ?? 0) + w.weight;
      }
    }

    const [bestName, bestScore] = Object.entries(scores).sort(
      (a, b) => b[1] - a[1],
    )[0] ?? ['—', 0];
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

    await ctx.reply('📊 Хочешь посмотреть свою статистику?', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Моя статистика', callback_data: 'my_stats' },
            { text: '🏠 Главное меню', callback_data: 'open_menu' },
          ],
        ],
      },
    });

    ctx.session = {};
  }

  async showStats(ctx: MyContext) {
    const tgId = String(ctx.from?.id);
    const user =
      await this.usersService.findByTelegramIdWithTestsAndResults(tgId);

    if (!user?.tests?.length) {
      await ctx.reply('Пока нет данных о пройденных тестах 🕐');
      return;
    }

    let msg = '📊 *История твоих тестов:*\n\n';
    user.tests.forEach((t, i) => {
      const date = new Date(t.createdAt).toLocaleString('ru-RU');
      const prof = t.result?.profession?.name ?? '—';
      const score = t.result?.scoreDetails
        ? Object.entries(t.result.scoreDetails)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : 'нет данных';
      msg += `🧾 Тест #${i + 1} — ${date}\n📌 Профессия: *${prof}*\n💯 Баллы: ${score}\n\n`;
    });

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  }

  async findAll(query: QueryParamsDto) {
    return paginateAndMap<TestModel, TestDto>(
      this.prisma,
      'test',
      query,
      (test) => ({
        id: test.id,
        userId: test.userId,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
      }),
    );
  }

  async findAllWithUserDto(query: QueryParamsDto) {
    return paginateAndMap(
      this.prisma,
      'test',
      query,
      (test: TestWithUserDto) => ({
        id: test.id,
        user: {
          id: test.user.id,
          telegramId: test.user.telegramId,
          firstName: test.user.firstName,
          lastName: test.user.lastName,
          username: test.user.username,
          phone: test.user.phone,
          role: test.user.role,
        },
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
      }),
      {
        user: true,
      },
    );
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id: id } });
    if (!test) throw new NotFoundException(`Test with id ${id} not found`);
    return test;
  }

  async findOneWithUser(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        user: true,
      }
    });
    if (!test) throw new NotFoundException(`Test with id ${id} not found`);
    return test;
  }
}
