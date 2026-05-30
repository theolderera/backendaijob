import {
  Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    const profile = await this.profilesService.findByUserId(userId);
    return profile ?? null;
  }

  @Get(':userId/analytics')
  @ApiOperation({ summary: 'Get profile analytics' })
  async getAnalytics(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.getAnalytics(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create or upsert profile' })
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profilesService.upsertByUserId(dto.userId ?? user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update profile by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, dto);
  }
}
