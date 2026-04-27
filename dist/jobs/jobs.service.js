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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
let JobsService = class JobsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    formatJob(job) {
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
        };
    }
    async findAll() {
        const jobs = await this.repo.find({ order: { createdAt: 'DESC' } });
        return jobs.map(this.formatJob.bind(this));
    }
    async findPaged(page, pageSize, title, location) {
        const where = {};
        if (title)
            where.title = (0, typeorm_2.Like)(`%${title}%`);
        if (location)
            where.location = (0, typeorm_2.Like)(`%${location}%`);
        const [items, totalCount] = await this.repo.findAndCount({
            where: Object.keys(where).length ? where : undefined,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalPages = Math.ceil(totalCount / pageSize) || 1;
        return {
            items: items.map(this.formatJob.bind(this)),
            page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
            totalCount,
        };
    }
    async search(title, location) {
        const where = {};
        if (title)
            where.title = (0, typeorm_2.Like)(`%${title}%`);
        if (location)
            where.location = (0, typeorm_2.Like)(`%${location}%`);
        const jobs = await this.repo.find({
            where: Object.keys(where).length ? where : undefined,
            order: { createdAt: 'DESC' },
        });
        return jobs.map(this.formatJob.bind(this));
    }
    async findOne(id) {
        const job = await this.repo.findOne({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException(`Job #${id} not found`);
        return this.formatJob(job);
    }
    async findByOrganization(orgId) {
        const jobs = await this.repo.find({
            where: { organizationId: orgId },
            order: { createdAt: 'DESC' },
        });
        return jobs.map(this.formatJob.bind(this));
    }
    async create(organizationId, dto) {
        const job = this.repo.create({ ...dto, organizationId });
        const saved = await this.repo.save(job);
        return this.formatJob(saved);
    }
    async update(id, orgId, dto) {
        const job = await this.repo.findOne({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException();
        if (job.organizationId !== orgId)
            throw new common_1.ForbiddenException();
        await this.repo.update(id, dto);
        const updated = await this.repo.findOne({ where: { id } });
        return this.formatJob(updated);
    }
    async remove(id, orgId) {
        const job = await this.repo.findOne({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException();
        if (job.organizationId !== orgId)
            throw new common_1.ForbiddenException();
        await this.repo.delete(id);
    }
    async findAllRaw() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map