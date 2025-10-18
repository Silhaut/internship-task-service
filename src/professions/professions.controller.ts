import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ProfessionsQueryDto } from '../common/data/dto/professions-query.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ProfessionDto } from '../common/data/dto/profession.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';

@Controller('professions')
export class ProfessionsController {
  constructor(private professionsService: ProfessionsService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @ApiExtraModels(ProfessionsQueryDto)
  @ApiPagedResponse(ProfessionDto)
  async getProfessions(@Query() query: ProfessionsQueryDto) {
    return this.professionsService.findAll(query);
  }
}
