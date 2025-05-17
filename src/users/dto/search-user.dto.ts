import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserSearchQuery {
  @ApiPropertyOptional({ example: 'John', description: 'Search by first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Search by last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 30, description: 'Search by age' })
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
