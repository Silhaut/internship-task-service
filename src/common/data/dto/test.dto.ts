import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { TestResultWithProfessionDto } from './test-result.dto';
import { TestAnswerWithAnswerAndQuestionDto } from './test-answer.dto';

export class TestDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' })
  userId: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class TestWithUserDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ type: () => UserDto }) user: UserDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class TestWithUserAndAnswerAndResultDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ type: () => UserDto }) user: UserDto;

  @ApiProperty({ type: () => [TestAnswerWithAnswerAndQuestionDto] })
  answers: TestAnswerWithAnswerAndQuestionDto[];

  @ApiProperty({ type: () => TestResultWithProfessionDto })
  result: TestResultWithProfessionDto;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
