import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
export declare class JobMatchingService {
    private readonly jobRepo;
    private readonly userSkillRepo;
    private readonly expRepo;
    constructor(jobRepo: Repository<Job>, userSkillRepo: Repository<UserSkill>, expRepo: Repository<Experience>);
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
