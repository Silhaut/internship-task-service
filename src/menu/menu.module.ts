import { Module } from '@nestjs/common';
import { MenuUpdate } from './menu.updater';

@Module({
  providers: [MenuUpdate],
  exports: [MenuUpdate],
})
export class MenuModule {}
