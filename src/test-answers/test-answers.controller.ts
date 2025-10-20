import { Controller, Get, Param, Query, UseGuards, Version } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestAnswerQueryDto } from '../common/data/dto/test-answer-query.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { TestAnswerDto, TestAnswerWithTestAndQuestionAndAnswerDto } from '../common/data/dto/test-answer.dto';
import { QueryParamsDto } from '../common/data/dto/query-params.dto';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Test Answers')
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'test-answers'
})
export class TestAnswersController {
  constructor(private testAnswersService: TestAnswersService) {}

  @Get()
  @ApiExtraModels(TestAnswerQueryDto)
  @ApiPagedResponse(TestAnswerDto)
  findAll(@Query() query: TestAnswerQueryDto) {
    return this.testAnswersService.findAll(query);
  }

  @Get()
  @Version('2')
  @ApiExtraModels(QueryParamsDto)
  @ApiPagedResponse(TestAnswerWithTestAndQuestionAndAnswerDto)
  findAllWithTestAndQuestionAndAnswer(@Query() query: QueryParamsDto) {
    return this.testAnswersService.findAllWithTestAndQuestionAndAnswer(query);
  }

  @Get(':id')
  @ApiResponse({ type: TestAnswerDto })
  findOne(@Param('id') id: string) {
    return this.testAnswersService.findOne(id);
  }

  @Get(':id')
  @Version('2')
  @ApiResponse({ type: TestAnswerWithTestAndQuestionAndAnswerDto })
  findOneWithTestAndQuestionAndAnswer(@Param('id') id: string) {
    return this.testAnswersService.findOneWithTestAndQuestionAndAnswer(id);
  }
}
