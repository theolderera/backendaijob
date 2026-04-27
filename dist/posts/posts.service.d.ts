import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PostsService {
    private readonly postRepo;
    private readonly likeRepo;
    private readonly commentRepo;
    private readonly notificationsService;
    constructor(postRepo: Repository<Post>, likeRepo: Repository<Like>, commentRepo: Repository<Comment>, notificationsService: NotificationsService);
    private toFeedItem;
    getFeed(currentUserId: number): Promise<{
        id: number;
        userId: number;
        organizationId: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        likeCount: number;
        likedByMe: boolean;
        repostCount: number;
        commentCount: number;
        authorName: string;
        authorImageUrl: string;
    }[]>;
    findOne(id: number, currentUserId: number): Promise<{
        id: number;
        userId: number;
        organizationId: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        likeCount: number;
        likedByMe: boolean;
        repostCount: number;
        commentCount: number;
        authorName: string;
        authorImageUrl: string;
    }>;
    create(userId: number, dto: CreatePostDto): Promise<{
        id: number;
        userId: number;
        organizationId: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        likeCount: number;
        likedByMe: boolean;
        repostCount: number;
        commentCount: number;
        authorName: string;
        authorImageUrl: string;
    }>;
    update(id: number, userId: number, dto: UpdatePostDto): Promise<{
        id: number;
        userId: number;
        organizationId: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        likeCount: number;
        likedByMe: boolean;
        repostCount: number;
        commentCount: number;
        authorName: string;
        authorImageUrl: string;
    }>;
    remove(id: number, userId: number): Promise<void>;
    toggleLike(postId: number, userId: number): Promise<{
        likeCount: number;
        likedByMe: boolean;
    }>;
    repost(postId: number, userId: number): Promise<{
        id: number;
        userId: number;
        organizationId: number;
        content: string;
        imageUrl: string;
        createdAt: Date;
        likeCount: number;
        likedByMe: boolean;
        repostCount: number;
        commentCount: number;
        authorName: string;
        authorImageUrl: string;
    }>;
    getComments(postId: number): Promise<{
        id: number;
        postId: number;
        userId: number;
        content: string;
        createdAt: Date;
        authorName: string;
        authorImageUrl: string;
    }[]>;
    addComment(postId: number, userId: number, dto: CreateCommentDto): Promise<{
        id: number;
        postId: number;
        userId: number;
        content: string;
        createdAt: Date;
        authorName: string;
        authorImageUrl: string;
    }>;
    deleteComment(commentId: number, userId: number): Promise<void>;
}
