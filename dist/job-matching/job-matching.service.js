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
exports.JobMatchingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../jobs/entities/job.entity");
const user_skill_entity_1 = require("../skills/entities/user-skill.entity");
const experience_entity_1 = require("../experience/entities/experience.entity");
let JobMatchingService = class JobMatchingService {
    jobRepo;
    userSkillRepo;
    expRepo;
    constructor(jobRepo, userSkillRepo, expRepo) {
        this.jobRepo = jobRepo;
        this.userSkillRepo = userSkillRepo;
        this.expRepo = expRepo;
    }
    async getRecommended(userId) {
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
    async getMatchExplanation(userId, jobId) {
        const job = await this.jobRepo.findOne({ where: { id: jobId } });
        const userSkills = await this.userSkillRepo.find({
            where: { userId },
            relations: ['skill'],
        });
        const skillNames = userSkills.map((us) => us.skill?.name ?? '');
        if (!job)
            return { score: 0, explanation: 'Job not found.' };
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
};
exports.JobMatchingService = JobMatchingService;
exports.JobMatchingService = JobMatchingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(user_skill_entity_1.UserSkill)),
    __param(2, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JobMatchingService);
//# sourceMappingURL=job-matching.service.js.map