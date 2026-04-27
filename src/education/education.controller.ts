import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('UserEducation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('UserEducation')
export class EducationController {
  constructor(private readonly service: EducationService) {}

  @Get('by-user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findByUser(userId);
  }

  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEducationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
