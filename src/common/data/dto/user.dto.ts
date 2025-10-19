import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: "80f86549-5b7d-4275-ae38-3168c7c22d38" }) id: string;
  @ApiProperty() telegramId: string;
  @ApiProperty() username: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() role: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
