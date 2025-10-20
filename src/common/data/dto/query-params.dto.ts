import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryParamsDto {
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 20;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';

  [key: string]: any;
}
