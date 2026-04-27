import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class AddSkillDto {
  userId: number;
  skillId: number;
}

@ApiTags('Skill')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Skill')
export class SkillController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.service.search(name ?? '');
  }
}

@ApiTags('UserSkill')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('UserSkill')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get('by-user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findByUser(userId);
  }

  @Post()
  add(@Body() dto: AddSkillDto) {
    return this.service.addToUser(dto.userId, dto.skillId);
  }

  @Delete('user/:userId/skill/:skillId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.service.removeFromUser(userId, skillId);
  }
}
