import { IsEmail, IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { UserPreferences } from '../domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;


  @IsOptional()
  preferences?: UserPreferences;
} 