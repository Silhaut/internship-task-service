import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '../common/data/dto/login-request.dto';
import { JwtResponseDto } from '../common/data/dto/jwt-response.dto';
import { UserDto } from '../common/data/dto/user.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ type: JwtResponseDto, status: HttpStatus.OK })
  login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserDto })
  async getMe(@Req() req) {
    return this.authService.getMe(req.user.id);
  }
}
