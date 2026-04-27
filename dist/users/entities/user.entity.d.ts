import { Profile } from '../../profiles/entities/profile.entity';
import { Post } from '../../posts/entities/post.entity';
import { Connection } from '../../connections/entities/connection.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Message } from '../../messages/entities/message.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { Organization } from '../../organizations/entities/organization.entity';
export declare enum UserRole {
    Candidate = "Candidate",
    Organization = "Organization",
    Admin = "Admin"
}
export declare class User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    role: UserRole;
    passwordResetToken: string | null;
    passwordResetExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    banUntil: Date | null;
    banReason: string;
    profile: Profile;
    posts: Post[];
    sentConnections: Connection[];
    receivedConnections: Connection[];
    notifications: Notification[];
    messages: Message[];
    jobApplications: JobApplication[];
    organization: Organization;
}
