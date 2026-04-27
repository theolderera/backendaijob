import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';
export declare class Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    user: User;
}
