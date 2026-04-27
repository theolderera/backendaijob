import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';
export declare class ConversationsService {
    private readonly repo;
    private readonly msgRepo;
    constructor(repo: Repository<Conversation>, msgRepo: Repository<Message>);
    private enrichConversation;
    findByUser(userId: number): Promise<{
        id: number;
        user1Id: number;
        user2Id: number;
        createdAt: Date;
        unreadCount: number;
        lastMessagePreview: string | null;
        lastMessageAt: Date | null;
        user1: {
            id: number;
            fullName: string;
        } | null;
        user2: {
            id: number;
            fullName: string;
        } | null;
    }[]>;
    findOrCreate(user1Id: number, otherUserId: number): Promise<{
        id: number;
        user1Id: number;
        user2Id: number;
        createdAt: Date;
        unreadCount: number;
        lastMessagePreview: string | null;
        lastMessageAt: Date | null;
        user1: {
            id: number;
            fullName: string;
        } | null;
        user2: {
            id: number;
            fullName: string;
        } | null;
    }>;
    remove(id: number, userId: number): Promise<void>;
}
