import { QueryParamsDto } from './query-params.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerOptionWeightQueryDto extends QueryParamsDto {
  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  id?: string;

  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  answerOptionId?: string;

  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  professionId?: string;

  @ApiPropertyOptional()
  weight?: number;
}