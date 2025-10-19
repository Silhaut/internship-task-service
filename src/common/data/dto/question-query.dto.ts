import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class QuestionQueryDto extends QueryParamsDto {
  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
  id?: string;

  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}
