import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';
export declare class Like {
    id: number;
    postId: number;
    userId: number;
    createdAt: Date;
    post: Post;
    user: User;
}
