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
import { ProfessionsService } from './professions.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ProfessionsQueryDto } from '../common/data/dto/professions-query.dto';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ProfessionDto } from '../common/data/dto/profession.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { CreateProfessionDto } from '../common/data/dto/create-profession.dto';
import { IdDto } from '../common/data/dto/id.dto';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@Controller({
  version: '1',
  path: 'professions',
})
export class ProfessionsController {
  constructor(private professionsService: ProfessionsService) {}

  @Post()
  @ApiBody({ type: CreateProfessionDto })
  @ApiResponse({ type: IdDto })
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionsService.create(createProfessionDto);
  }

  @Get()
  @ApiExtraModels(ProfessionsQueryDto)
  @ApiPagedResponse(ProfessionDto)
  getProfessions(@Query() query: ProfessionsQueryDto) {
    return this.professionsService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ type: ProfessionDto })
  getProfession(@Param('id') id: string) {
    return this.professionsService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: CreateProfessionDto })
  @ApiResponse({ type: IdDto })
  update(
    @Param('id') id: string,
    @Body() createProfessionDto: CreateProfessionDto,
  ) {
    return this.professionsService.update(id, createProfessionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.professionsService.delete(id);
  }
}
