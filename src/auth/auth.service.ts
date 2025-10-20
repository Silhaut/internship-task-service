import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from '../common/data/dto/login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from '../common/data/dto/jwt-payload.dto';
import { UserDto } from '../common/data/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../common/data/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.usersService.findByUsername(dto.username);

    if (!user)
      throw new NotFoundException(
        `User with username ${dto.username} not found`,
      );

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return this.generateToken(user);
  }

  private async generateToken(user: UserModel) {
    const userInfo: Omit<UserDto, 'id'> = {
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    const payload: JwtPayloadDto = {
      sub: user.id,
      user: userInfo,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
