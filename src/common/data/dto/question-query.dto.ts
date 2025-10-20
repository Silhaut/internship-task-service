import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class QuestionQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}
