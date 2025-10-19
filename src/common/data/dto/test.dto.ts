import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class TestDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) userId: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class TestWithUserDto {
  @ApiProperty({ example: '80f86549-5b7d-4275-ae38-3168c7c22d38' }) id: string;
  @ApiProperty() user: UserDto;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}