export declare class CreateOrganizationDto {
    name: string;
    description?: string;
    industry?: string;
    location?: string;
    website?: string;
    logoUrl?: string;
    bannerUrl?: string;
}
export declare class UpdateOrganizationDto extends CreateOrganizationDto {
}
