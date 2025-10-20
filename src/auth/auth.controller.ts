import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '../common/data/dto/login-request.dto';
import { JwtResponseDto } from '../common/data/dto/jwt-response.dto';

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
}
