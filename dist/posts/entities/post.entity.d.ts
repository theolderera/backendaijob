import { User } from '../../users/entities/user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Organization } from '../../organizations/entities/organization.entity';
export declare class Post {
    id: number;
    userId: number;
    organizationId: number;
    content: string;
    imageUrl: string;
    repostOfId: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    organization: Organization;
    repostOf: Post;
    likes: Like[];
    comments: Comment[];
}
