import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

interface MyContext extends Context {}

@Update()
export class MenuUpdate {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Command('menu')
  async onMenuCommand(@Ctx() ctx: MyContext) {
    await this.showMenu(ctx);
  }

  @Action('main_menu')
  async onMainMenuAction(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await this.showMenu(ctx);
  }

  @Action('start_test')
  async onStartTestAction(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await ctx.reply('🧠 Запускаю тест...', { reply_markup: { remove_keyboard: true } });

    // 👉 Здесь можно просто вызвать твой TestUpdate.startTest()
    // Например, через PrismaService или event emitter, если вынесешь логику в сервис.
  }

  @Action('my_stats')
  async onStatsAction(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await ctx.reply('📊 Загружаю твою статистику...');

    // 👉 Можно вызвать TestUpdate.showStats() или просто вставить сюда вызов Prisma.
  }

  @Action('help')
  async onHelp(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await ctx.reply(
      `ℹ️ *Помощь*\n\n` +
      `🧠 /test — пройти тест\n` +
      `📊 /stats — посмотреть результаты\n` +
      `🏠 /menu — открыть главное меню`,
      { parse_mode: 'Markdown' },
    );
  }

  private async showMenu(ctx: MyContext) {
    await ctx.reply('📋 Главное меню', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧠 Пройти тест', callback_data: 'start_test' },
            { text: '📊 Моя статистика', callback_data: 'my_stats' },
          ],
          [{ text: 'ℹ️ Помощь', callback_data: 'help' }],
        ]
      }
    })
  }

  private async onStats(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();

    const tgId = String(ctx.from?.id);
    const user = await this.prisma.user.findUnique({
      where: { telegramId: tgId },
      include: {
        tests: {
          include: {
            result: { include: { profession: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

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
}