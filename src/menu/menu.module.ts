import { Module } from '@nestjs/common';
import { MenuUpdate } from './menu.updater';
import { TestModule } from '../test/test.module';

@Module({
  imports: [TestModule],
  providers: [MenuUpdate],
  exports: [MenuUpdate],
})
export class MenuModule {}
