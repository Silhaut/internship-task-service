import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class AnswerOptionsQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  questionId?: string;

  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}
