import { Controller } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';

@Controller('test-answers')
export class TestAnswersController {
  constructor(private readonly testAnswersService: TestAnswersService) {}
}
