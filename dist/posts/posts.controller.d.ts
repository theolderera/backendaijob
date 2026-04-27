import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class PostsController {
    private readonly service;
    constructor(service: PostsService);
    getFeed(user: CurrentUserPayload): Promise<{
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
    getAll(user: CurrentUserPayload): Promise<{
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
    findOne(id: number, user: CurrentUserPayload): Promise<{
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
    create(user: CurrentUserPayload, dto: CreatePostDto): Promise<{
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
    update(id: number, user: CurrentUserPayload, dto: UpdatePostDto): Promise<{
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
    remove(id: number, user: CurrentUserPayload): Promise<void>;
    toggleLike(postId: number, user: CurrentUserPayload): Promise<{
        likeCount: number;
        likedByMe: boolean;
    }>;
    repost(postId: number, user: CurrentUserPayload): Promise<{
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
    addComment(postId: number, user: CurrentUserPayload, dto: CreateCommentDto): Promise<{
        id: number;
        postId: number;
        userId: number;
        content: string;
        createdAt: Date;
        authorName: string;
        authorImageUrl: string;
    }>;
    deleteComment(postId: number, commentId: number, user: CurrentUserPayload): Promise<void>;
}
