import { BaseEntity } from '../../../infra/database/interfaces/base-entity.interface';
import { ApiProperty } from '@nestjs/swagger';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}

export class UserEntity implements BaseEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'hashed_password' })
  password: string;

  @ApiProperty({ 
    type: 'object',
    example: { theme: 'light', notifications: true },
    description: 'User preferences',
    additionalProperties: false,
    properties: {
      theme: { type: 'string', enum: ['light', 'dark'] },
      notifications: { type: 'boolean' }
    }
  })
  preferences: UserPreferences;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  deletedAt?: Date;

  constructor({
    id,
    email,
    name,
    password,
    preferences,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  }: {
    id: string;
    email: string;
    name: string;
    password: string;
    preferences: UserPreferences;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.preferences = preferences;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static create(
    email: string,
    name: string,
    password: string,
    preferences: UserPreferences,
  ): UserEntity {
    const id = crypto.randomUUID();
    return new UserEntity({
      id,
      email,
      name,
      password,
      preferences,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();
  }

  updatePreferences(preferences: UserPreferences): void {
    this.preferences = preferences;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }

  reactivate(): void {
    this.isActive = true;
    this.deletedAt = undefined;
    this.updatedAt = new Date();
  }
} 