import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
export declare class Organization {
    id: number;
    ownerId: number;
    owner: User;
    name: string;
    description: string;
    industry: string;
    location: string;
    website: string;
    logoUrl: string;
    bannerUrl: string;
    createdAt: Date;
    updatedAt: Date;
    jobs: Job[];
}
