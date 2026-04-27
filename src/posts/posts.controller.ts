import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Post')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get('feed')
  getFeed(@CurrentUser() user: CurrentUserPayload) {
    return this.service.getFeed(user.id);
  }

  @Get()
  getAll(@CurrentUser() user: CurrentUserPayload) {
    return this.service.getFeed(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreatePostDto) {
    return this.service.create(user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdatePostDto,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }

  @Post(':postId/like')
  @HttpCode(HttpStatus.OK)
  toggleLike(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.toggleLike(postId, user.id);
  }

  @Post(':postId/repost')
  repost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.repost(postId, user.id);
  }

  @Get(':postId/comments')
  getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.service.getComments(postId);
  }

  @Post(':postId/comments')
  addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCommentDto,
  ) {
    return this.service.addComment(postId, user.id, dto);
  }

  @Delete(':postId/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.deleteComment(commentId, user.id);
  }
}
