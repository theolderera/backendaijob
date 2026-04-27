import { MessagesService } from './messages.service';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class MessagesController {
    private readonly service;
    constructor(service: MessagesService);
    findByConversation(conversationId: number): Promise<import("./entities/message.entity").Message[]>;
    send(user: CurrentUserPayload, dto: {
        conversationId: number;
        content: string;
    }): Promise<import("./entities/message.entity").Message>;
    remove(id: number, user: CurrentUserPayload): Promise<void>;
}
