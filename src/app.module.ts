import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma/prisma.module';
import * as LocalSession from 'telegraf-session-local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    TelegrafModule.forRootAsync({
      useFactory: (configService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
        middlewares: [new LocalSession({ database: 'session.json' }).middleware()],
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
