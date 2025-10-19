import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from './query-params.dto';

export class UsersQueryDto extends QueryParamsDto {
  @ApiPropertyOptional({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" })
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
