import { Repository } from 'typeorm';
import { Connection, ConnectionStatus } from './entities/connection.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ConnectionsService {
    private readonly repo;
    private readonly notificationsService;
    constructor(repo: Repository<Connection>, notificationsService: NotificationsService);
    private formatConn;
    findMy(userId: number): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    findPending(userId: number): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    findAll(userId: number): Promise<{
        id: number;
        requesterId: number;
        addresseeId: number;
        status: ConnectionStatus;
        createdAt: Date;
        otherUser: {
            id: number;
            fullName: string;
            imageUrl: any;
            headline: any;
        } | null;
    }[]>;
    send(requesterId: number, addresseeId: number): Promise<Connection>;
    respond(id: number, userId: number, accept: boolean): Promise<Connection>;
    remove(id: number): Promise<void>;
}
