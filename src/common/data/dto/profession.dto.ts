import { ApiProperty } from '@nestjs/swagger';

export class ProfessionDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string
  @ApiProperty() name: string
  @ApiProperty() description: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
}