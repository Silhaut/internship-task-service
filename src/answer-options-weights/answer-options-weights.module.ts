import { Module } from '@nestjs/common';
import { AnswerOptionsWeightsService } from './answer-options-weights.service';
import { AnswerOptionsWeightsController } from './answer-options-weights.controller';

@Module({
  controllers: [AnswerOptionsWeightsController],
  providers: [AnswerOptionsWeightsService],
})
export class AnswerOptionsWeightsModule {}
