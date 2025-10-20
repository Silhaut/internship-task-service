import { QueryParamsDto } from './query-params.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerOptionWeightQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  answerOptionId?: string;

  @ApiPropertyOptional()
  professionId?: string;

  @ApiPropertyOptional()
  weight?: number;
}