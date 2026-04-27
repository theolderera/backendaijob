import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Language')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class LanguagesController {
  constructor(private readonly service: LanguagesService) {}

  @Get('Language')
  findAll() {
    return this.service.findAll();
  }

  @Get('ProfileLanguage/by-profile/:profileId')
  findByProfile(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.service.findByProfile(profileId);
  }

  @Post('ProfileLanguage')
  add(@Body() dto: { profileId: number; languageId: number; level: string }) {
    return this.service.add(dto.profileId, dto.languageId, dto.level);
  }

  @Put('ProfileLanguage/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: { level: string }) {
    return this.service.update(id, dto.level);
  }

  @Delete('ProfileLanguage/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
