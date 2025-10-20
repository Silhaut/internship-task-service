import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class TestResultQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  testId?: string;

  @ApiPropertyOptional()
  professionId?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}