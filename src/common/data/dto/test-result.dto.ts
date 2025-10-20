import { ApiProperty } from '@nestjs/swagger';
import { TestWithUserDto } from './test.dto';
import { ProfessionDto } from './profession.dto';

export class TestResultDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) testId: string;
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) professionId: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class TestResultWithTestAndProfessionDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty({ type: () => TestWithUserDto }) test: TestWithUserDto
  @ApiProperty({ type: () => ProfessionDto }) profession: ProfessionDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class TestResultWithProfessionDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) testId: string;
  @ApiProperty({ type: () => ProfessionDto }) profession: ProfessionDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}