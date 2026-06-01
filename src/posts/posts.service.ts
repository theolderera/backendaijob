import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ConnectionsService } from '../connections/connections.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    private readonly notificationsService: NotificationsService,
    private readonly connectionsService: ConnectionsService,
  ) {}

  private async toFeedItem(post: Post, currentUserId: number) {
    const likeCount = await this.likeRepo.count({ where: { postId: post.id } });
    const commentCount = await this.commentRepo.count({ where: { postId: post.id } });
    const likedByMe = !!(await this.likeRepo.findOne({
      where: { postId: post.id, userId: currentUserId },
    }));
    const repostCount = await this.postRepo.count({ where: { repostOfId: post.id } });

    return {
      id: post.id,
      userId: post.userId,
      organizationId: post.organizationId,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      likeCount,
      likedByMe,
      repostCount,
      commentCount,
      authorName: post.user?.fullName ?? 'Unknown',
      authorImageUrl: post.user?.profile?.avatarUrl ?? null,
    };
  }

  async getFeed(currentUserId: number) {
    const conns = await this.connectionsService.findMy(currentUserId);
    const connectionIds = conns.map(c => c.otherUser?.id).filter(id => id != null) as number[];
    const userIds = [currentUserId, ...connectionIds];

    const posts = await this.postRepo.find({
      where: { userId: In(userIds) },
      order: { createdAt: 'DESC' },
      relations: ['user', 'user.profile'],
      take: 50,
    });
    return Promise.all(posts.map((p) => this.toFeedItem(p, currentUserId)));
  }

  async getAllPosts(currentUserId: number) {
    const posts = await this.postRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['user', 'user.profile'],
      take: 50,
    });
    return Promise.all(posts.map((p) => this.toFeedItem(p, currentUserId)));
  }

  async findOne(id: number, currentUserId: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'user.profile'],
    });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return this.toFeedItem(post, currentUserId);
  }

  async create(userId: number, dto: CreatePostDto) {
    const post = this.postRepo.create({ ...dto, userId });
    const saved = await this.postRepo.save(post);
    const full = await this.postRepo.findOne({
      where: { id: saved.id },
      relations: ['user', 'user.profile'],
    });
    return this.toFeedItem(full!, userId);
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.userId !== userId) throw new ForbiddenException();
    await this.postRepo.update(id, dto);
    const updated = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'user.profile'],
    });
    return this.toFeedItem(updated!, userId);
  }

  async remove(id: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.userId !== userId) throw new ForbiddenException();
    await this.postRepo.delete(id);
  }

  async toggleLike(postId: number, userId: number) {
    const existing = await this.likeRepo.findOne({ where: { postId, userId } });
    if (existing) {
      await this.likeRepo.delete(existing.id);
    } else {
      await this.likeRepo.save(this.likeRepo.create({ postId, userId }));
      // Notify post owner
      const post = await this.postRepo.findOne({ where: { id: postId } });
      if (post && post.userId !== userId) {
        await this.notificationsService.create(
          post.userId,
          'Someone liked your post',
          'Your post received a new like.',
          'like',
          `/`,
        );
      }
    }
    const likeCount = await this.likeRepo.count({ where: { postId } });
    const likedByMe = !existing;
    return { likeCount, likedByMe };
  }

  async repost(postId: number, userId: number) {
    const original = await this.postRepo.findOne({ where: { id: postId } });
    if (!original) throw new NotFoundException();
    const repost = this.postRepo.create({
      userId,
      content: original.content,
      imageUrl: original.imageUrl,
      repostOfId: postId,
    });
    const saved = await this.postRepo.save(repost);
    const full = await this.postRepo.findOne({
      where: { id: saved.id },
      relations: ['user', 'user.profile'],
    });
    return this.toFeedItem(full!, userId);
  }

  async getComments(postId: number) {
    const comments = await this.commentRepo.find({
      where: { postId },
      order: { createdAt: 'ASC' },
      relations: ['user', 'user.profile'],
    });
    return comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      userId: c.userId,
      content: c.content,
      createdAt: c.createdAt,
      authorName: c.user?.fullName ?? 'Unknown',
      authorImageUrl: c.user?.profile?.avatarUrl ?? null,
    }));
  }

  async addComment(postId: number, userId: number, dto: CreateCommentDto) {
    const comment = this.commentRepo.create({ postId, userId, content: dto.content });
    const saved = await this.commentRepo.save(comment);

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (post && post.userId !== userId) {
      await this.notificationsService.create(
        post.userId,
        'New comment on your post',
        'Someone commented on your post.',
        'comment',
        `/`,
      );
    }

    const full = await this.commentRepo.findOne({
      where: { id: saved.id },
      relations: ['user', 'user.profile'],
    });
    return {
      id: full!.id,
      postId: full!.postId,
      userId: full!.userId,
      content: full!.content,
      createdAt: full!.createdAt,
      authorName: full!.user?.fullName ?? 'Unknown',
      authorImageUrl: full!.user?.profile?.avatarUrl ?? null,
    };
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException();
    if (comment.userId !== userId) throw new ForbiddenException();
    await this.commentRepo.delete(commentId);
  }
}
