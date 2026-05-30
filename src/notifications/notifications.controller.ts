import {
  Controller, Get, Post, Patch, Delete, Param, Query, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Notification')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('by-user/:userId')
  findByUser(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findByUser(user.id);
  }

  @Get('paged')
  findPaged(
    @CurrentUser() user: CurrentUserPayload,
    @Query('PageNumber') page = '1',
    @Query('PageSize') pageSize = '20',
  ) {
    return this.service.findPaged(user.id, parseInt(page), parseInt(pageSize));
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.markRead(id, user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@CurrentUser() user: CurrentUserPayload) {
    return this.service.markAllRead(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }
}
