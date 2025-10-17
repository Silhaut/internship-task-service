import { Module } from '@nestjs/common';
import { TestModule } from '../test/test.module';
import { MenuService } from './menu.service';
import { MenuUpdate } from './menu.update';

@Module({
  imports: [TestModule],
  providers: [MenuUpdate, MenuService],
  exports: [MenuUpdate],
})
export class MenuModule {}
