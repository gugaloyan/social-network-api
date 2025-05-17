import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 30, required: false, description: 'User age (optional)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}


export class UserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 30, description: 'Age of the user', required: false, nullable: true })
  age?: number;

  @ApiProperty({ example: '2025-05-17T15:30:00Z', description: 'User creation date' })
  createdAt: Date;
}


export class AuthResponse {
    @ApiProperty()
    token: string;
  
    @ApiProperty({ type: UserDto })
    user: UserDto;
  }