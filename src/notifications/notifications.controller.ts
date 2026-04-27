import {
  Controller, Get, Post, Patch, Delete, Param, Query, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Notification')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('by-user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findByUser(userId);
  }

  @Get('paged')
  findPaged(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('PageNumber') page = '1',
    @Query('PageSize') pageSize = '20',
  ) {
    return this.service.findPaged(userId, parseInt(page), parseInt(pageSize));
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markRead(id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@Body() dto: { userId: number }) {
    return this.service.markAllRead(dto.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
