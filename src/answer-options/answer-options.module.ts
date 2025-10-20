import { Module } from '@nestjs/common';
import { AnswerOptionsService } from './answer-options.service';
import { AnswerOptionsController } from './answer-options.controller';

@Module({
  controllers: [AnswerOptionsController],
  providers: [AnswerOptionsService],
})
export class AnswerOptionsModule {}
