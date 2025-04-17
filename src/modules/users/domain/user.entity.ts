import { BaseEntity } from '../../../infra/database/interfaces/base-entity.interface';
import { v4 as uuidv4 } from 'uuid';
export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}

export class UserEntity implements BaseEntity {
  id: string;

  email: string;

  name: string;

  password: string;

  preferences: UserPreferences;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  deletedAt?: string;

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
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
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

  static create({
    email,
    name,
    password,
    preferences,
  }: {
    email: string;
    name: string;
    password: string;
    preferences: UserPreferences;
  }): UserEntity {
    return new UserEntity({
      id: uuidv4(),
      email,
      name,
      password,
      preferences,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
