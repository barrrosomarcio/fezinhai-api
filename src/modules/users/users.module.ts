import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../infra/database/database.module';
import { UserMapper } from './mappers/user.mapper';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserMapper, JwtService],
  exports: [UserService],
})
export class UsersModule {} 