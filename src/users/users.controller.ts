import {
  Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Body,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

class UpdateUserDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() phoneNumber?: string;
}

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile (who am I)' })
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    const userFull = await this.usersService.findById(user.id);
    if (!userFull) return null;
    const { passwordHash: _unused, ...safe } = userFull;
    return safe;
  }

  @Get('directory')
  @ApiOperation({ summary: 'Get all users (directory)' })
  async directory() {
    const users = await this.usersService.findAll();
    return users.map((u: User) => ({
      id: u.id,
      fullName: u.fullName,
      userName: u.email.split('@')[0],
      email: u.email,
      role: u.role,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    const { passwordHash, ...safe } = user as any;
    return safe;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    const { passwordHash, ...safe } = user as any;
    return safe;
  }
}
