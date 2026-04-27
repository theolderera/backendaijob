import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Job } from '../jobs/entities/job.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
export declare class AiService {
    private readonly configService;
    private readonly userSkillRepo;
    private readonly expRepo;
    private readonly jobRepo;
    private readonly profileRepo;
    private readonly userRepo;
    constructor(configService: ConfigService, userSkillRepo: Repository<UserSkill>, expRepo: Repository<Experience>, jobRepo: Repository<Job>, profileRepo: Repository<Profile>, userRepo: Repository<User>);
    private detectLanguage;
    private findBestMatch;
    ask(question: string, userId: number): Promise<{
        answer: string;
    }>;
    analyzeCv(dto: {
        userId?: number;
        cvText?: string;
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
