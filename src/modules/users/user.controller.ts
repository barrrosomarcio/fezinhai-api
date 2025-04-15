import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from './domain/user.entity';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The user has been successfully created.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request. Invalid input data.' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict. User with this email already exists.' 
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(this.userService.create(createUserDto));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully retrieved.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.userService.findOne(id));
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully retrieved.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async findByEmail(@Param('email') email: string) {
    return firstValueFrom(this.userService.findByEmail(email));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully updated.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request. Invalid input data.' 
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return firstValueFrom(this.userService.update(id, updateUserDto));
  }

  @Patch(':id/preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserPreferencesDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The user preferences have been successfully updated.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request. Invalid input data.' 
  })
  async updatePreferences(
    @Param('id') id: string,
    @Body() preferencesDto: UpdateUserPreferencesDto,
  ) {
    return firstValueFrom(this.userService.updatePreferences(id, preferencesDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'The user has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async remove(@Param('id') id: string) {
    return firstValueFrom(this.userService.remove(id));
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully deactivated.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async deactivate(@Param('id') id: string) {
    return firstValueFrom(this.userService.deactivate(id));
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully activated.',
    type: UserEntity
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  async activate(@Param('id') id: string) {
    return firstValueFrom(this.userService.activate(id));
  }
} 