import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnswerOptionsService } from './answer-options.service';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { IdDto } from '../common/data/dto/id.dto';
import { CreateAnswerOptionDto } from '../common/data/dto/create-answer-option.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { AnswerOptionDto } from '../common/data/dto/answer-option.dto';
import { AnswerOptionsQueryDto } from '../common/data/dto/answer-options-query.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { UpdateAnswerOptionTextDto } from '../common/data/dto/update-answer-option-text.dto';

@Roles(Role.USER)
@UseGuards(AuthGuard, RolesGuard)
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

  @Get(':id')
  @ApiResponse({ type: AnswerOptionDto })
  findOne(@Param('id') id: string) {
    return this.answerOptionsService.findOne(id);
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
