import { Test, TestingModule } from '@nestjs/testing';
import { AnswerOptionsWeightsService } from './answer-options-weights.service';

describe('AnswerOptionsWeightsService', () => {
  let service: AnswerOptionsWeightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerOptionsWeightsService],
    }).compile();

    service = module.get<AnswerOptionsWeightsService>(AnswerOptionsWeightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
