import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { ApiBearerAuth, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { TestService } from './test.service';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { TestDto, TestWithUserDto } from '../common/data/dto/test.dto';
import { TestQueryDto } from '../common/data/dto/test-query.dto';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  version: '1',
  path: 'tests',
})
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  @ApiPagedResponse(TestDto)
  @ApiExtraModels(TestQueryDto)
  findAll(@Query() query: TestQueryDto) {
    return this.testService.findAll(query);
  }

  @Get()
  @Version('2')
  @ApiPagedResponse(TestWithUserDto)
  @ApiExtraModels(TestQueryDto)
  findAllWithUserDto(@Query() query: TestQueryDto) {
    return this.testService.findAllWithUserDto(query);
  }

  @Get(':id')
  @ApiResponse({ type: TestDto })
  findOne(@Param('id') id: string) {
    return this.testService.findOne(id);
  }

  @Get(':id')
  @Version('2')
  @ApiResponse({ type: TestWithUserDto })
  findOneWithUser(@Param('id') id: string) {
    return this.testService.findOneWithUser(id);
  }
}
