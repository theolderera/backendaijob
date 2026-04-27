export declare class CreateEducationDto {
    userId: number;
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}
export declare class UpdateEducationDto extends CreateEducationDto {
}
