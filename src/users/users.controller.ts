import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiExtraModels } from '@nestjs/swagger';
import { UserDto } from '../common/data/dto/user.dto';
import { ApiPagedResponse } from '../common/decorators/api-paged-response.decorator';
import { UsersQueryDto } from '../common/data/dto/users-query.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @ApiExtraModels(UsersQueryDto)
  @ApiPagedResponse(UserDto)
  async getUsers(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }
}
