import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerOptionTextDto {
  @ApiProperty() text: string;
}