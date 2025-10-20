import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class TestAnswerQueryDto extends QueryParamsDto {
  @ApiPropertyOptional() id?: string;
  @ApiPropertyOptional() testId?: string;
  @ApiPropertyOptional() questionId?: string;
  @ApiPropertyOptional() answerId?: string;
}