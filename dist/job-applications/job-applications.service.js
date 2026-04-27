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
exports.JobApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_application_entity_1 = require("./entities/job-application.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let JobApplicationsService = class JobApplicationsService {
    repo;
    notificationsService;
    constructor(repo, notificationsService) {
        this.repo = repo;
        this.notificationsService = notificationsService;
    }
    async findByUser(userId) {
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            relations: ['job', 'job.organization'],
        });
    }
    async findByJob(jobId) {
        return this.repo.find({
            where: { jobId },
            order: { createdAt: 'DESC' },
            relations: ['user', 'job'],
        });
    }
    async apply(userId, jobId, coverLetter) {
        const existing = await this.repo.findOne({ where: { userId, jobId } });
        if (existing)
            throw new common_1.ConflictException('Already applied to this job');
        const app = this.repo.create({
            userId,
            jobId,
            coverLetter,
            status: job_application_entity_1.ApplicationStatus.Pending,
        });
        return this.repo.save(app);
    }
    async updateStatus(id, status) {
        const app = await this.repo.findOne({ where: { id }, relations: ['job'] });
        if (!app)
            throw new common_1.NotFoundException();
        app.status = status;
        const saved = await this.repo.save(app);
        await this.notificationsService.create(app.userId, 'Application status updated', `Your application for "${app.job?.title}" is now ${status}.`, 'job', `/jobs/${app.jobId}`);
        return saved;
    }
    async remove(id) {
        const app = await this.repo.findOne({ where: { id } });
        if (!app)
            throw new common_1.NotFoundException();
        await this.repo.delete(id);
    }
};
exports.JobApplicationsService = JobApplicationsService;
exports.JobApplicationsService = JobApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], JobApplicationsService);
//# sourceMappingURL=job-applications.service.js.map