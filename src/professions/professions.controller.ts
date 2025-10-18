import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ProfessionsQueryDto } from '../common/data/dto/professions-query.dto';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ProfessionDto } from '../common/data/dto/profession.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { CreateProfessionDto } from '../common/data/dto/create-profession.dto';
import { IdDto } from '../common/data/dto/id.dto';

@Roles('ADMIN')
@UseGuards(AuthGuard)
@Controller({
  version: '1',
  path: 'professions'
})
export class ProfessionsController {
  constructor(private professionsService: ProfessionsService) {}

  @Post()
  @ApiBody({ type: CreateProfessionDto })
  @ApiResponse({ type: IdDto })
  async create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionsService.create(createProfessionDto);
  }

  @Get()
  @ApiExtraModels(ProfessionsQueryDto)
  @ApiPagedResponse(ProfessionDto)
  async getProfessions(@Query() query: ProfessionsQueryDto) {
    return this.professionsService.findAll(query);
  }
}
