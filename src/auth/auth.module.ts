import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUpdate } from './auth.update';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [AuthService, AuthUpdate],
  controllers: [AuthController],
})
export class AuthModule {}
