export declare class CreateProfileDto {
    userId?: number;
    headline?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    website?: string;
    phone?: string;
    openToWork?: boolean;
}
export declare class UpdateProfileDto extends CreateProfileDto {
}
