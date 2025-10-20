import { Action, Command, Ctx, Hears, Update } from 'nestjs-telegraf';
import { TestService } from '../test/test.service';
import { MyContext } from '../common/data/dto/my-context.interface';
import { MenuService } from './menu.service';

@Update()
export class MenuUpdate {
  constructor(
    private testService: TestService,
    private menuService: MenuService,
  ) {}

  @Command('menu')
  @Hears(['🏠 Главное меню', /^\/menu$/])
  @Action('open_menu')
  async handleMenu(@Ctx() ctx: MyContext) {
    console.log('📥 Меню');
    await this.safeCb(ctx);
    await this.menuService.showMenu(ctx);
  }

  @Command('test')
  @Hears(['🧠 Пройти тест', /^\/test$/])
  @Action('start_test')
  async handleTest(@Ctx() ctx: MyContext) {
    await this.safeCb(ctx);
    await this.testService.startTest(ctx);
  }

  @Command('stats')
  @Hears(['📊 Моя статистика', /^\/stats$/])
  @Action('my_stats')
  async handleStats(@Ctx() ctx: MyContext) {
    await this.safeCb(ctx);
    await this.testService.showStats(ctx);
  }

  // @Command('help')
  // @Hears(['ℹ️ Помощь', /^\/help$/])
  // @Action('help')
  // async handleHelp(@Ctx() ctx: MyContext) {
  //   await this.safeCb(ctx);
  //   await ctx.reply(
  //     `ℹ️ *Помощь*\n\n` +
  //     `🧠 /test — пройти тест\n` +
  //     `📊 /stats — посмотреть результаты\n` +
  //     `🏠 /menu — открыть главное меню`,
  //     { parse_mode: 'Markdown' },
  //   );
  // }

  private async safeCb(ctx: MyContext) {
    try {
      await ctx.answerCbQuery();
    } catch {}
  }
}
