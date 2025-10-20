import { ApiProperty } from '@nestjs/swagger';

export class IdDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  id: string;
}