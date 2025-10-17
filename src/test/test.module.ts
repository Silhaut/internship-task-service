import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestUpdate } from './test.update';
import { TestService } from './test.service';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { TestAnswersModule } from '../test-answers/test-answers.module';
import { ProfessionsModule } from '../professions/professions.module';
import { TestResultsModule } from '../test-results/test-results.module';

@Module({
  imports: [
    UsersModule,
    QuestionsModule,
    TestAnswersModule,
    ProfessionsModule,
    TestResultsModule,
  ],
  providers: [TestUpdate, PrismaService, TestService],
})
export class TestModule {}
