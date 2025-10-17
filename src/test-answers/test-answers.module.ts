import { Module } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';
import { TestAnswersController } from './test-answers.controller';
import { TestModule } from '../test/test.module';

@Module({
  controllers: [TestAnswersController],
  providers: [TestAnswersService],
  exports: [TestAnswersService],
})
export class TestAnswersModule {}
