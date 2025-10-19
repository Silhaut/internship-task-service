import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class TestResultQueryDto extends QueryParamsDto {
  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  id?: string;

  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  testId?: string;

  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  professionId?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}