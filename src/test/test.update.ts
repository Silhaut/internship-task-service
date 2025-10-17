import { Action, Ctx, Update } from 'nestjs-telegraf';
import { TestService } from './test.service';
import { MyContext } from '../data/dto/my-context.interface';

@Update()
export class TestUpdate {
  constructor(private testService: TestService) {
    console.log('✅ TestUpdate подключен');
  }

  @Action(/answer_.+/)
  async onAnswer(@Ctx() ctx: MyContext) {
    const data = (ctx.callbackQuery as any).data;
    const answerId = data.replace('answer_', '');
    await this.testService.recordAnswer(ctx, answerId);
  }
}
