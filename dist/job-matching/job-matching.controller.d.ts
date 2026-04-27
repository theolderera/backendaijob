import { JobMatchingService } from './job-matching.service';
export declare class JobMatchingController {
    private readonly service;
    constructor(service: JobMatchingService);
    getRecommended(userId: number): Promise<{
        id: number;
        title: string;
        description: string;
        location: string;
        employmentType: string;
        experienceLevel: string;
        salary: string;
        organizationId: number;
        organizationName: string;
        companyName: string;
        createdAt: Date;
        matchScore: number;
    }[]>;
    getMatchExplanation(userId: number, jobId: number): Promise<{
        score: number;
        explanation: string;
        matchingSkills?: undefined;
        missingSkills?: undefined;
    } | {
        score: number;
        explanation: string;
        matchingSkills: string[];
        missingSkills: string[];
    }>;
}
