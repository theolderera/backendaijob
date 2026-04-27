import { User } from '../../users/entities/user.entity';
export declare class Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string;
    createdAt: Date;
    user: User;
}
