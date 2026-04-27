import { User } from '../../users/entities/user.entity';
export declare class Experience {
    id: number;
    userId: number;
    user: User;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
}
