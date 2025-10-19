import { Controller, UseGuards } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'test-results'
})
export class TestResultsController {
  constructor(private testResultsService: TestResultsService) {}
}
