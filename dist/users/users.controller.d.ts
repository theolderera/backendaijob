import { UsersService } from './users.service';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
declare class UpdateUserDto {
    fullName?: string;
    phoneNumber?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: CurrentUserPayload): Promise<{
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
    } | null>;
    directory(): Promise<{
        id: number;
        fullName: string;
        userName: string;
        email: string;
        role: import("./entities/user.entity").UserRole;
    }[]>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
}
export {};
