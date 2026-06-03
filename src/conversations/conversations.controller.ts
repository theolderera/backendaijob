import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Conversation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Conversation')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findByUser(user.id);
  }

  @Post()
  @ApiBody({ schema: { type: 'object', properties: { otherUserId: { type: 'number' } } } })
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: { otherUserId: number }) {
    return this.service.findOrCreate(user.id, dto.otherUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }
}
