import { ApiProperty } from '@nestjs/swagger';

export class SimpleUserDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty() username: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() createdAt: Date;
}

export class TopProfessionDto {
  @ApiProperty() profession: string;
  @ApiProperty() count: number;
}

export class UserStatsDto {
  @ApiProperty() total: number;
  @ApiProperty({ type: Object }) byRole: Record<string, number>;
  @ApiProperty({ type: [SimpleUserDto] }) latest: SimpleUserDto[];
}

export class SimpleTestDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ type: () => SimpleUserDto }) user: SimpleUserDto;
  @ApiProperty() profession: string;
  @ApiProperty() createdAt: Date;
}

export class TestStatsDto {
  @ApiProperty() total: number;
  @ApiProperty() completed: number;
  @ApiProperty() inProgress: number;
  @ApiProperty({ type: [TopProfessionDto] }) topProfessions: TopProfessionDto[];
  @ApiProperty({ type: [SimpleTestDto] }) latest: SimpleTestDto[];
}

export class QuestionStatsDto {
  @ApiProperty() total: number;
  @ApiProperty() totalAnswers: number;
  @ApiProperty() avgAnswersPerQuestion: number;
}

export class ProfessionStatsDto {
  @ApiProperty() total: number;
  @ApiProperty() mostCommon: string;
}

export class AdminOverviewDto {
  @ApiProperty({ type: () => UserStatsDto })
  users: UserStatsDto;

  @ApiProperty({ type: () => TestStatsDto })
  tests: TestStatsDto;

  @ApiProperty({ type: () => QuestionStatsDto })
  questions: QuestionStatsDto;

  @ApiProperty({ type: () => ProfessionStatsDto })
  professions: ProfessionStatsDto;
}