import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';

@Injectable()
export class JobMatchingService {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(UserSkill) private readonly userSkillRepo: Repository<UserSkill>,
    @InjectRepository(Experience) private readonly expRepo: Repository<Experience>,
  ) {}

  async getRecommended(userId: number) {
    const userSkills = await this.userSkillRepo.find({
      where: { userId },
      relations: ['skill'],
    });
    const skillNames = userSkills.map((us) => us.skill?.name?.toLowerCase() ?? '');

    const jobs = await this.jobRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });

    const scored = jobs.map((job) => {
      const jobText = `${job.title} ${job.description}`.toLowerCase();
      const matchCount = skillNames.filter((s) => s && jobText.includes(s)).length;
      const score = skillNames.length > 0 ? Math.round((matchCount / skillNames.length) * 100) : 50;
      return {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        organizationId: job.organizationId,
        organizationName: job.organization?.name ?? null,
        companyName: job.organization?.name ?? null,
        createdAt: job.createdAt,
        matchScore: score,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }

  async getMatchExplanation(userId: number, jobId: number) {
    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    const userSkills = await this.userSkillRepo.find({
      where: { userId },
      relations: ['skill'],
    });
    const skillNames = userSkills.map((us) => us.skill?.name ?? '');

    if (!job) return { score: 0, explanation: 'Job not found.' };

    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const matching = skillNames.filter((s) => s && jobText.includes(s.toLowerCase()));
    const missing = skillNames.filter((s) => s && !jobText.includes(s.toLowerCase()));
    const score = skillNames.length > 0 ? Math.round((matching.length / skillNames.length) * 100) : 50;

    return {
      score,
      explanation: `You match ${score}% of the requirements. Matching skills: ${matching.join(', ') || 'none'}. Consider improving: ${missing.slice(0, 3).join(', ') || 'none'}.`,
      matchingSkills: matching,
      missingSkills: missing,
    };
  }
}
