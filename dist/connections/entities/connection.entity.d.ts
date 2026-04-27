import { User } from '../../users/entities/user.entity';
export declare enum ConnectionStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected"
}
export declare class Connection {
    id: number;
    requesterId: number;
    addresseeId: number;
    status: ConnectionStatus;
    createdAt: Date;
    updatedAt: Date;
    requester: User;
    addressee: User;
}
