import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { IdDto } from '../common/data/dto/id.dto';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from '../common/data/dto/create-question.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { QuestionDto } from '../common/data/dto/question.dto';
import { QuestionQueryDto } from '../common/data/dto/question-query.dto';
import { QuestionWithAnswerOptionsDto } from '../common/data/dto/question-with-answer-options.dto';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'questions',
})
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ type: IdDto })
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<IdDto> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiExtraModels(QuestionQueryDto)
  @ApiPagedResponse(QuestionDto)
  getMany(@Query() query: QuestionQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: QuestionDto })
  getOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Get(':id/answer-options')
  @ApiResponse({ type: QuestionWithAnswerOptionsDto })
  getOneWithAnswerOptions(@Param('id') id: string) {
    return this.questionsService.findOneWithAnswerOptions(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ type: IdDto })
  update(
    @Param('id') id: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<IdDto> {
    return this.questionsService.update(id, createQuestionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.questionsService.delete(id);
  }
}
