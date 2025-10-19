import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma/prisma.module';
import * as LocalSession from 'telegraf-session-local';
import { TestModule } from './test/test.module';
import { MenuModule } from './menu/menu.module';
import { QuestionsModule } from './questions/questions.module';
import { TestAnswersModule } from './test-answers/test-answers.module';
import { ProfessionsModule } from './professions/professions.module';
import { TestResultsModule } from './test-results/test-results.module';
import { AnswerOptionsModule } from './answer-options/answer-options.module';
import { AnswerOptionsWeightsModule } from './answer-options-weights/answer-options-weights.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    TestModule,
    MenuModule,
    QuestionsModule,
    TestAnswersModule,
    ProfessionsModule,
    TestResultsModule,
    AnswerOptionsModule,
    AnswerOptionsWeightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
