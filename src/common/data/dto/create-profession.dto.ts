import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}