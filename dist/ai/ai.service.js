"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_skill_entity_1 = require("../skills/entities/user-skill.entity");
const experience_entity_1 = require("../experience/entities/experience.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const profile_entity_1 = require("../profiles/entities/profile.entity");
let AiService = class AiService {
    configService;
    userSkillRepo;
    expRepo;
    jobRepo;
    profileRepo;
    anthropicApiKey;
    constructor(configService, userSkillRepo, expRepo, jobRepo, profileRepo) {
        this.configService = configService;
        this.userSkillRepo = userSkillRepo;
        this.expRepo = expRepo;
        this.jobRepo = jobRepo;
        this.profileRepo = profileRepo;
        this.anthropicApiKey = this.configService.get('ANTHROPIC_API_KEY', '');
    }
    async callClaude(prompt) {
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
        }
        catch (err) {
            return this.generateMockResponse(prompt);
        }
    }
    generateMockResponse(prompt) {
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
    async ask(question) {
        const answer = await this.callClaude(`You are a professional career advisor. ${question}`);
        return { answer };
    }
    async analyzeCv(dto) {
        const text = dto.cvText || `CV for user ${dto.userId}`;
        const response = await this.callClaude(`Analyze this CV and extract key skills as a JSON array and provide a brief summary:\n\n${text}\n\nRespond with: {"skills": [...], "summary": "..."}`);
        try {
            const parsed = JSON.parse(response);
            return { skills: parsed.skills ?? [], summary: parsed.summary ?? response };
        }
        catch {
            return { skills: [], summary: response };
        }
    }
    async skillGap(userId, jobId) {
        const userSkills = await this.userSkillRepo.find({ where: { userId }, relations: ['skill'] });
        const job = await this.jobRepo.findOne({ where: { id: jobId } });
        const skillNames = userSkills.map((us) => us.skill?.name ?? '');
        const jobText = job ? `${job.title} ${job.description}` : '';
        const matching = skillNames.filter((s) => s && jobText.toLowerCase().includes(s.toLowerCase()));
        const missing = skillNames.filter((s) => s && !jobText.toLowerCase().includes(s.toLowerCase()));
        return { matchingSkills: matching, missingSkills: missing };
    }
    async improveJob(dto) {
        const prompt = `Improve this job posting to be more attractive and clear:\nTitle: ${dto.title}\nDescription: ${dto.description}\nLocation: ${dto.location}`;
        const improvedDescription = await this.callClaude(prompt);
        return { improvedDescription };
    }
    async draftCoverLetter(dto) {
        const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
        const profile = await this.profileRepo.findOne({ where: { userId: dto.userId } });
        const userSkills = await this.userSkillRepo.find({ where: { userId: dto.userId }, relations: ['skill'] });
        const prompt = `Write a professional cover letter for the following:\nJob: ${job?.title ?? 'the position'}\nJob Description: ${job?.description ?? ''}\nApplicant Skills: ${userSkills.map((us) => us.skill?.name).join(', ')}\nApplicant Bio: ${profile?.bio ?? ''}\nTone: ${dto.tone ?? 'professional'}\nExtra Context: ${dto.extraContext ?? ''}`;
        const coverLetter = await this.callClaude(prompt);
        return { coverLetter };
    }
    async draftMessage(dto) {
        const prompt = `Draft a professional LinkedIn message:\nRecipient: ${dto.recipientName ?? 'Hiring Manager'}\nPurpose: ${dto.purpose ?? 'networking'}\nTone: ${dto.tone ?? 'professional'}`;
        const message = await this.callClaude(prompt);
        return { message };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_skill_entity_1.UserSkill)),
    __param(2, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(3, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(4, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AiService);
//# sourceMappingURL=ai.service.js.map