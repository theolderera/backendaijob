import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Job } from '../jobs/entities/job.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class AiService {
  private anthropicApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserSkill) private readonly userSkillRepo: Repository<UserSkill>,
    @InjectRepository(Experience) private readonly expRepo: Repository<Experience>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
  ) {
    this.anthropicApiKey = this.configService.get<string>('ANTHROPIC_API_KEY', '');
  }

  private async callClaude(prompt: string): Promise<string> {
    if (!this.anthropicApiKey) {
      return this.generateMockResponse(prompt);
    }
    try {
      const Anthropic = require('@anthropic-ai/sdk');
      const client = new Anthropic.default({ apiKey: this.anthropicApiKey });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (err) {
      return this.generateMockResponse(prompt);
    }
  }

  // Produces reasonable mock output when no Anthropic API key is set
  private generateMockResponse(prompt: string): string {
    if (prompt.includes('cover letter')) {
      return 'Dear Hiring Manager,\n\nI am writing to express my strong interest in this position. My experience and skills make me an excellent candidate for this role. I am passionate about contributing to your team and believe I can add significant value.\n\nSincerely,\nApplicant';
    }
    if (prompt.includes('skill gap')) {
      return 'Based on the job requirements, consider developing: TypeScript, Node.js, and system design skills to strengthen your candidacy.';
    }
    if (prompt.includes('CV') || prompt.includes('resume')) {
      return 'Your CV shows strong technical background. Key skills identified: JavaScript, React, Node.js. Consider adding more quantifiable achievements.';
    }
    if (prompt.includes('job description') || prompt.includes('improve')) {
      return 'Enhanced job description with clearer requirements, competitive benefits, and growth opportunities to attract top talent.';
    }
    return 'Thank you for your question. Based on your profile and the available information, I recommend focusing on building core technical skills, networking actively, and tailoring your applications to each specific opportunity.';
  }

  async ask(question: string): Promise<{ answer: string }> {
    const answer = await this.callClaude(`You are a professional career advisor. ${question}`);
    return { answer };
  }

  async analyzeCv(dto: {
    userId?: number;
    cvText?: string;
    cvFileUrl?: string;
  }): Promise<{ skills: string[]; summary: string }> {
    const text = dto.cvText || `CV for user ${dto.userId}`;
    const response = await this.callClaude(
      `Analyze this CV and extract key skills as a JSON array and provide a brief summary:\n\n${text}\n\nRespond with: {"skills": [...], "summary": "..."}`,
    );
    try {
      const parsed = JSON.parse(response);
      return { skills: parsed.skills ?? [], summary: parsed.summary ?? response };
    } catch {
      return { skills: [], summary: response };
    }
  }

  async skillGap(userId: number, jobId: number): Promise<{ missingSkills: string[]; matchingSkills: string[] }> {
    const userSkills = await this.userSkillRepo.find({ where: { userId }, relations: ['skill'] });
    const job = await this.jobRepo.findOne({ where: { id: jobId } });

    const skillNames = userSkills.map((us) => us.skill?.name ?? '');
    const jobText = job ? `${job.title} ${job.description}` : '';

    const matching = skillNames.filter((s) => s && jobText.toLowerCase().includes(s.toLowerCase()));
    const missing = skillNames.filter((s) => s && !jobText.toLowerCase().includes(s.toLowerCase()));

    return { matchingSkills: matching, missingSkills: missing };
  }

  async improveJob(dto: {
    title?: string;
    description?: string;
    location?: string;
  }): Promise<{ improvedDescription: string }> {
    const prompt = `Improve this job posting to be more attractive and clear:\nTitle: ${dto.title}\nDescription: ${dto.description}\nLocation: ${dto.location}`;
    const improvedDescription = await this.callClaude(prompt);
    return { improvedDescription };
  }

  async draftCoverLetter(dto: {
    userId: number;
    jobId: number;
    tone?: string;
    extraContext?: string;
  }): Promise<{ coverLetter: string }> {
    const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
    const profile = await this.profileRepo.findOne({ where: { userId: dto.userId } });
    const userSkills = await this.userSkillRepo.find({ where: { userId: dto.userId }, relations: ['skill'] });

    const prompt = `Write a professional cover letter for the following:\nJob: ${job?.title ?? 'the position'}\nJob Description: ${job?.description ?? ''}\nApplicant Skills: ${userSkills.map((us) => us.skill?.name).join(', ')}\nApplicant Bio: ${profile?.bio ?? ''}\nTone: ${dto.tone ?? 'professional'}\nExtra Context: ${dto.extraContext ?? ''}`;
    const coverLetter = await this.callClaude(prompt);
    return { coverLetter };
  }

  async draftMessage(dto: {
    userId: number;
    recipientName?: string;
    purpose?: string;
    tone?: string;
  }): Promise<{ message: string }> {
    const prompt = `Draft a professional LinkedIn message:\nRecipient: ${dto.recipientName ?? 'Hiring Manager'}\nPurpose: ${dto.purpose ?? 'networking'}\nTone: ${dto.tone ?? 'professional'}`;
    const message = await this.callClaude(prompt);
    return { message };
  }
}
