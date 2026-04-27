import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    findByUser(userId: number): Promise<import("./entities/notification.entity").Notification[]>;
    findPaged(userId: number, page?: string, pageSize?: string): Promise<{
        items: import("./entities/notification.entity").Notification[];
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        totalCount: number;
    }>;
    markRead(id: number): Promise<import("./entities/notification.entity").Notification>;
    markAllRead(dto: {
        userId: number;
    }): Promise<void>;
    remove(id: number): Promise<void>;
}
