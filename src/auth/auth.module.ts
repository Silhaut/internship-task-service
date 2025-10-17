import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUpdate } from './auth.update';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, AuthUpdate],
  controllers: [AuthController],
})
export class AuthModule {}
