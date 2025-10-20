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
import { AnswerOptionsWeightsService } from './answer-options-weights.service';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAnswerOptionWeightDto } from '../common/data/dto/create-answer-option-weight.dto';
import { IdDto } from '../common/data/dto/id.dto';
import { AnswerOptionWeightQueryDto } from '../common/data/dto/answer-option-weight-query.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import {
  AnswerOptionWeightDto,
  AnswerOptionWeightWithAnswerOptionAndProfessionDto,
} from '../common/data/dto/answer-option-weight.dto';
import { UpdateOptionWeightDto } from '../common/data/dto/update-option-weight.dto';

@ApiTags('Answer Option Weights')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'answer-options-weights',
})
export class AnswerOptionsWeightsController {
  constructor(
    private answerOptionsWeightsService: AnswerOptionsWeightsService,
  ) {}

  @Post()
  @ApiBody({ type: CreateAnswerOptionWeightDto })
  @ApiResponse({ type: IdDto })
  create(@Body() createAnswerOptionWeightDto: CreateAnswerOptionWeightDto) {
    return this.answerOptionsWeightsService.create(createAnswerOptionWeightDto);
  }

  @Get()
  @ApiExtraModels(AnswerOptionWeightQueryDto)
  @ApiPagedResponse(AnswerOptionWeightDto)
  findAll(@Query() query: AnswerOptionWeightQueryDto) {
    return this.answerOptionsWeightsService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: AnswerOptionWeightDto })
  findOne(@Param('id') id: string) {
    return this.answerOptionsWeightsService.findOne(id);
  }

  @Get(':id')
  @Version('2')
  @ApiResponse({ type: AnswerOptionWeightWithAnswerOptionAndProfessionDto })
  findOneWithAnswerOptionAdnProfession(@Param('id') id: string) {
    return this.answerOptionsWeightsService.findOneWithAnswerOptionAdnProfession(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateOptionWeightDto })
  @ApiResponse({ type: IdDto })
  update(@Param('id') id: string, @Body() updateAnswerOptionWeightDto: UpdateOptionWeightDto,) {
    return this.answerOptionsWeightsService.update(id, updateAnswerOptionWeightDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.answerOptionsWeightsService.delete(id);
  }
}
