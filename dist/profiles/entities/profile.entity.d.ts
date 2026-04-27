import { User } from '../../users/entities/user.entity';
import { ProfileLanguage } from '../../languages/entities/profile-language.entity';
export declare class Profile {
    id: number;
    userId: number;
    user: User;
    headline: string;
    bio: string;
    location: string;
    avatarUrl: string;
    bannerUrl: string;
    website: string;
    phone: string;
    openToWork: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileLanguages: ProfileLanguage[];
}
