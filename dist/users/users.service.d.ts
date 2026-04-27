import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, dto: {
        fullName?: string;
        phoneNumber?: string;
    }): Promise<User>;
    sanitize(user: User): {
        id: number;
        fullName: string;
        email: string;
        phoneNumber: string;
        role: import("./entities/user.entity").UserRole;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        banUntil: Date | null;
        banReason: string;
        profile: import("../profiles/entities/profile.entity").Profile;
        posts: import("../posts/entities/post.entity").Post[];
        sentConnections: import("../connections/entities/connection.entity").Connection[];
        receivedConnections: import("../connections/entities/connection.entity").Connection[];
        notifications: import("../notifications/entities/notification.entity").Notification[];
        messages: import("../messages/entities/message.entity").Message[];
        jobApplications: import("../job-applications/entities/job-application.entity").JobApplication[];
        organization: import("../organizations/entities/organization.entity").Organization;
    };
}
