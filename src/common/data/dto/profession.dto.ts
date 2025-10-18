import { ApiProperty } from '@nestjs/swagger';

export class ProfessionDto {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() description: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
}