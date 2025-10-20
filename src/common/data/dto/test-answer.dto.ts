import { ApiProperty } from '@nestjs/swagger';
import { TestWithUserDto } from './test.dto';
import { QuestionDto } from './question.dto';
import { AnswerOptionDto } from './answer-option.dto';

export class TestAnswerDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) testId: string;
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) questionId: string;
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) answerId: string;
}

export class TestAnswerWithTestAndQuestionAndAnswerDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty() test: TestWithUserDto;
  @ApiProperty() question: QuestionDto;
  @ApiProperty() answer: AnswerOptionDto;
}

export class TestAnswerWithAnswerAndQuestionDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty() answer: AnswerOptionDto;
  @ApiProperty() question: QuestionDto;
}