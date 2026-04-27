import { ConversationsService } from './conversations.service';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class ConversationsController {
    private readonly service;
    constructor(service: ConversationsService);
    findAll(user: CurrentUserPayload): Promise<{
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
    create(user: CurrentUserPayload, dto: {
        otherUserId: number;
    }): Promise<{
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
    remove(id: number, user: CurrentUserPayload): Promise<void>;
}
