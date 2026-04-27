import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Message')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get('by-conversation/:conversationId')
  findByConversation(@Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.service.findByConversation(conversationId);
  }

  @Post()
  send(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: { conversationId: number; content: string },
  ) {
    return this.service.send(dto.conversationId, user.id, dto.content);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }
}
