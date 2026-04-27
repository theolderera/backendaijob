import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    private readonly repo;
    constructor(repo: Repository<Message>);
    findByConversation(conversationId: number): Promise<Message[]>;
    send(conversationId: number, senderId: number, content: string): Promise<Message>;
    remove(id: number, userId: number): Promise<void>;
}
