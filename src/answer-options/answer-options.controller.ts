import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards, Version,
} from '@nestjs/common';
import { AnswerOptionsService } from './answer-options.service';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdDto } from '../common/data/dto/id.dto';
import { CreateAnswerOptionDto } from '../common/data/dto/create-answer-option.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { AnswerOptionDto, AnswerOptionWithQuestionDto } from '../common/data/dto/answer-option.dto';
import { AnswerOptionsQueryDto } from '../common/data/dto/answer-options-query.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { UpdateAnswerOptionTextDto } from '../common/data/dto/update-answer-option-text.dto';

@ApiTags('Answer Options')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'answer-options',
})
export class AnswerOptionsController {
  constructor(private answerOptionsService: AnswerOptionsService) {}

  @Post()
  @ApiBody({ type: CreateAnswerOptionDto })
  @ApiResponse({ type: IdDto })
  create(@Body() dto: CreateAnswerOptionDto) {
    return this.answerOptionsService.create(dto);
  }

  @Get()
  @ApiExtraModels(AnswerOptionsQueryDto)
  @ApiPagedResponse(AnswerOptionDto)
  findAll(@Query() query: AnswerOptionsQueryDto) {
    return this.answerOptionsService.findAll(query);
  }

  @Version('2')
  @Get()
  @ApiExtraModels(AnswerOptionsQueryDto)
  @ApiPagedResponse(AnswerOptionWithQuestionDto)
  findAllWithQuestionDto(@Query() query: AnswerOptionsQueryDto) {
    return this.answerOptionsService.findAllWithQuestionDto(query);
  }

  @Get(':id')
  @ApiResponse({ type: AnswerOptionDto })
  findOne(@Param('id') id: string) {
    return this.answerOptionsService.findOne(id);
  }

  @Get(':id')
  @Version('2')
  @ApiResponse({ type: AnswerOptionWithQuestionDto })
  findOneWithQuestionDto(@Param('id') id: string) {
    return this.answerOptionsService.findOneWithQuestionDto(id);
  }

  @Put(':id/text')
  @ApiBody({ type: UpdateAnswerOptionTextDto })
  @ApiResponse({ type: IdDto })
  updateText(@Param('id') id: string, @Body() dto: UpdateAnswerOptionTextDto) {
    return this.answerOptionsService.updateText(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.answerOptionsService.delete(id);
  }
}
