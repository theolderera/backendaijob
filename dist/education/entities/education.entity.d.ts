import { User } from '../../users/entities/user.entity';
export declare class Education {
    id: number;
    userId: number;
    user: User;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
}
