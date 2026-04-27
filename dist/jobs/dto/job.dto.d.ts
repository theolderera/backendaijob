export declare class CreateJobDto {
    title: string;
    description: string;
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    salary?: string;
    organizationId?: number;
}
export declare class UpdateJobDto extends CreateJobDto {
}
