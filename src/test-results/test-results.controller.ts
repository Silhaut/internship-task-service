import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import {
  TestResultDto,
  TestResultWithTestDto,
} from '../common/data/dto/test-result.dto';
import { TestResultQueryDto } from '../common/data/dto/test-result-query.dto';
import { IdDto } from '../common/data/dto/id.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';

@ApiTags('Test Results')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'results',
})
export class TestResultsController {
  constructor(private testResultsService: TestResultsService) {}

  @Get()
  @ApiPagedResponse(TestResultDto)
  @ApiExtraModels(QueryParamsDto)
  findAll(@Query() query: TestResultQueryDto) {
    return this.testResultsService.findAll(query);
  }

  @Get()
  @Version('2')
  @ApiPagedResponse(TestResultWithTestDto)
  @ApiExtraModels(QueryParamsDto)
  findAllWithTestDto(@Query() query: IdDto) {
    return this.testResultsService.findAllWithTestAndUserDto(query);
  }
  
  @Get(':id')
  @ApiResponse({ type: TestResultDto })
  findOne(@Param('id') id: string) {
    return this.testResultsService.findOne(id);
  }

  @Get(':id')
  @Version('2')
  @ApiResponse({ type: TestResultWithTestDto })
  findOneWithTestAndProfessionDto(@Param('id') id: string) {
    return this.testResultsService.findOneWithTestAndProfessionDto(id);
  }
}
