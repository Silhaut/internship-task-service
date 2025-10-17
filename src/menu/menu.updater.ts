import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { TestService } from '../test/test.service';
import { MyContext } from '../data/dto/my-context.interface';

@Update()
export class MenuUpdate {
  constructor(private testService: TestService) {}

  @Command('menu')
  async onMenu(@Ctx() ctx: MyContext) {
    await this.showMenu(ctx);
  }

  @Action('main_menu')
  async onMainMenu(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await this.showMenu(ctx);
  }

  @Action('start_test')
  async onStartTest(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await this.testService.startTest(ctx);
  }

  @Action('my_stats')
  async onMyStats(@Ctx() ctx: MyContext) {
    await ctx.answerCbQuery();
    await this.testService.showStats(ctx);
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

  async showMenu(ctx: MyContext) {
    await ctx.reply('📋 Главное меню', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧠 Пройти тест', callback_data: 'start_test' },
            { text: '📊 Моя статистика', callback_data: 'my_stats' },
          ],
          [{ text: 'ℹ️ Помощь', callback_data: 'help' }],
        ],
      },
    });
  }
}
