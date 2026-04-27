export declare class CreateExperienceDto {
    userId: number;
    title: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
}
export declare class UpdateExperienceDto extends CreateExperienceDto {
}
