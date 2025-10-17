import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class JwtPayloadDto {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  user: Omit<UserDto, 'id'>;

  @ApiProperty()
  role: string;
}
