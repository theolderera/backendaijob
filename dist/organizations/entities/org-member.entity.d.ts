import { Organization } from './organization.entity';
import { User } from '../../users/entities/user.entity';
export declare class OrgMember {
    id: number;
    organizationId: number;
    userId: number;
    role: string;
    joinedAt: Date;
    organization: Organization;
    user: User;
}
