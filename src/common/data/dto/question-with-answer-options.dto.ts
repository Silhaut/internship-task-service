import { ApiProperty } from '@nestjs/swagger';
import { AnswerOptionDto } from './answer-option.dto';

export class QuestionWithAnswerOptionsDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty() text: string;
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
  @ApiProperty({ type: [AnswerOptionDto]}) answerOptions: AnswerOptionDto[];
}