import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    fullName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    role?: UserRole;
}
