import { Test, TestingModule } from '@nestjs/testing';
import { AnswerOptionsWeightsController } from './answer-options-weights.controller';
import { AnswerOptionsWeightsService } from './answer-options-weights.service';

describe('AnswerOptionsWeightsController', () => {
  let controller: AnswerOptionsWeightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerOptionsWeightsController],
      providers: [AnswerOptionsWeightsService],
    }).compile();

    controller = module.get<AnswerOptionsWeightsController>(AnswerOptionsWeightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
