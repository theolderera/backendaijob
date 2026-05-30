import {
  Controller, Get, Post, Put, Delete, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Connection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Connection')
export class ConnectionsController {
  constructor(private readonly service: ConnectionsService) {}

  @Get('my')
  findMy(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findMy(user.id);
  }

  @Get('pending')
  findPending(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findPending(user.id);
  }

  @Get('all')
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findAll(user.id);
  }

  @Post('send/:addresseeId')
  send(
    @CurrentUser() user: CurrentUserPayload,
    @Param('addresseeId', ParseIntPipe) addresseeId: number,
  ) {
    return this.service.send(user.id, addresseeId);
  }

  @Put(':id/respond')
  respond(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: { accept: boolean },
  ) {
    return this.service.respond(id, user.id, dto.accept);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }
}
