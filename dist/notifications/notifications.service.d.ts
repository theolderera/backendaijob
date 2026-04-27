import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationsService {
    private readonly repo;
    constructor(repo: Repository<Notification>);
    findByUser(userId: number): Promise<Notification[]>;
    findPaged(userId: number, page: number, pageSize: number): Promise<{
        items: Notification[];
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        totalCount: number;
    }>;
    create(userId: number, title: string, message: string, type: string, link?: string): Promise<Notification>;
    markRead(id: number): Promise<Notification>;
    markAllRead(userId: number): Promise<void>;
    remove(id: number): Promise<void>;
}
