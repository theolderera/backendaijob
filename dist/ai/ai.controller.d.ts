import { AiService } from './ai.service';
export declare class AiController {
    private readonly service;
    constructor(service: AiService);
    ask(dto: {
        question: string;
    }): Promise<{
        answer: string;
    }>;
    analyzeCv(dto: {
        userId?: number;
        cvText?: string;
        cvFileUrl?: string;
    }): Promise<{
        skills: string[];
        summary: string;
    }>;
    skillGap(userId: number, jobId: number): Promise<{
        missingSkills: string[];
        matchingSkills: string[];
    }>;
    improveJob(dto: {
        title?: string;
        description?: string;
        location?: string;
    }): Promise<{
        improvedDescription: string;
    }>;
    draftCoverLetter(dto: {
        userId: number;
        jobId: number;
        tone?: string;
        extraContext?: string;
    }): Promise<{
        coverLetter: string;
    }>;
    draftMessage(dto: {
        userId: number;
        recipientName?: string;
        purpose?: string;
        tone?: string;
    }): Promise<{
        message: string;
    }>;
}
