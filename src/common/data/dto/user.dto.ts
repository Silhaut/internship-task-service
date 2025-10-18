import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty() id: string;
  @ApiProperty() telegramId: string;
  @ApiProperty() username: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() role: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
