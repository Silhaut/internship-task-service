import { Controller } from '@nestjs/common';
import { TestResultsService } from './test-results.service';

@Controller('test-results')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}
}
