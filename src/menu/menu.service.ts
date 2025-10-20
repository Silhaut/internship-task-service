import { Injectable } from '@nestjs/common';
import { MyContext } from '../common/data/dto/my-context.interface';

@Injectable()
export class MenuService {
  constructor() {}

  async showMenu(ctx: MyContext) {
    await ctx.reply('📋 Главное меню', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧠 Пройти тест', callback_data: 'start_test' },
            { text: '📊 Моя статистика', callback_data: 'my_stats' },
          ],
          // [{ text: 'ℹ️ Помощь', callback_data: 'help' }],
        ],
      },
    });
  }
}
