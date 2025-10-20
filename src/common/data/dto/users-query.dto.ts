import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class UsersQueryDto extends QueryParamsDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  telegramId?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  role?: string;

  @ApiPropertyOptional()
  createdAt?: string;
}
