import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUpdate } from './auth.update';

@Module({
  providers: [AuthUpdate],
  controllers: [AuthController],
})
export class AuthModule {}
