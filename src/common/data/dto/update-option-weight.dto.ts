import { ApiProperty } from '@nestjs/swagger';

export class UpdateOptionWeightDto {
  @ApiProperty() weight: number;
}