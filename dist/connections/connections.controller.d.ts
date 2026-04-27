import { ConnectionsService } from './connections.service';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class ConnectionsController {
    private readonly service;
    constructor(service: ConnectionsService);
    findMy(user: CurrentUserPayload): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: import("./entities/connection.entity").ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    findPending(user: CurrentUserPayload): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: import("./entities/connection.entity").ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    findAll(user: CurrentUserPayload): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: import("./entities/connection.entity").ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    send(user: CurrentUserPayload, addresseeId: number): Promise<import("./entities/connection.entity").Connection>;
    respond(id: number, user: CurrentUserPayload, dto: {
        accept: boolean;
    }): Promise<import("./entities/connection.entity").Connection>;
    remove(id: number): Promise<void>;
}
