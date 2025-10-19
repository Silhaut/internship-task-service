import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { TestAnswersModule } from '../test-answers/test-answers.module';
import { ProfessionsModule } from '../professions/professions.module';
import { TestResultsModule } from '../test-results/test-results.module';
import { TestUpdate } from './test.update';
import { TestController } from './test.controller';

@Module({
  imports: [
    UsersModule,
    QuestionsModule,
    TestAnswersModule,
    ProfessionsModule,
    TestResultsModule,
  ],
  providers: [TestService, TestUpdate],
  exports: [TestService],
  controllers: [TestController],
})
export class TestModule {}
