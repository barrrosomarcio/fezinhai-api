import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from '../domain/user.entity';

export class UpdateUserPreferencesDto implements Partial<UserPreferences> {
  @ApiProperty({ 
    example: 'dark',
    enum: ['light', 'dark'],
    required: false,
    description: 'User interface theme preference'
  })
  @IsEnum(['light', 'dark'])
  @IsOptional()
  theme?: 'light' | 'dark';

  @ApiProperty({ 
    example: true,
    required: false,
    description: 'Whether to receive notifications'
  })
  @IsBoolean()
  @IsOptional()
  notifications?: boolean;
} 