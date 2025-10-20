import { ApiProperty } from '@nestjs/swagger';
import { AnswerOptionDto, AnswerOptionWithQuestionDto } from './answer-option.dto';
import { ProfessionDto } from './profession.dto';

export class AnswerOptionWeightDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) answerOptionId: string;
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) professionId: string;
  @ApiProperty() weight: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class AnswerOptionWeightWithAnswerOptionAndProfessionDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty() weight: number;
  @ApiProperty() answerOption: AnswerOptionWithQuestionDto;
  @ApiProperty() profession: ProfessionDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}