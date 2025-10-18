import { ApiProperty } from '@nestjs/swagger';

export class PagedDataDto<T> {
  @ApiProperty()
  data: T

  @ApiProperty()
  totalSize: number

  @ApiProperty()
  page: number

  @ApiProperty()
  size: number

  @ApiProperty()
  totalPage: number
}