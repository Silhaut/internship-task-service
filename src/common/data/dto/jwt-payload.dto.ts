import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class JwtPayloadDto {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  user: {
    username: string;
  };

  @ApiProperty({ enum: Role })
  role: Role;
}
