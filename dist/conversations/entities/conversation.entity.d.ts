import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
export declare class Conversation {
    id: number;
    user1Id: number;
    user2Id: number;
    createdAt: Date;
    user1: User;
    user2: User;
    messages: Message[];
}
