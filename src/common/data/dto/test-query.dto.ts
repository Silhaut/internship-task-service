import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class TestQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}