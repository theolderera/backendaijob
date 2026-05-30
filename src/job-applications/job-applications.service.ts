import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication) private readonly repo: Repository<JobApplication>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findByUser(userId: number) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['job', 'job.organization'],
    });
  }

  async findByJob(jobId: number) {
    return this.repo.find({
      where: { jobId },
      order: { createdAt: 'DESC' },
      relations: ['user', 'job'],
    });
  }

  async findByOrganization(orgId: number) {
    return this.repo.find({
      where: { job: { organizationId: orgId } },
      order: { createdAt: 'DESC' },
      relations: ['job', 'user'],
    });
  }

  async apply(userId: number, jobId: number, coverLetter?: string) {
    const existing = await this.repo.findOne({ where: { userId, jobId } });
    if (existing) throw new ConflictException('Already applied to this job');

    const app = this.repo.create({
      userId,
      jobId,
      coverLetter,
      status: ApplicationStatus.Pending,
    });
    return this.repo.save(app);
  }

  async updateStatus(id: number, status: ApplicationStatus, currentUserId: number) {
    const app = await this.repo.findOne({ where: { id }, relations: ['job', 'job.organization'] });
    if (!app) throw new NotFoundException();
    if (app.job?.organization?.ownerId !== currentUserId) {
      throw new ForbiddenException('You do not own this organization');
    }
    app.status = status;
    const saved = await this.repo.save(app);

    await this.notificationsService.create(
      app.userId,
      'Application status updated',
      `Your application for "${app.job?.title}" is now ${status}.`,
      'job',
      `/jobs/${app.jobId}`,
    );

    return saved;
  }

  async remove(id: number, currentUserId: number) {
    const app = await this.repo.findOne({ where: { id }, relations: ['job', 'job.organization'] });
    if (!app) throw new NotFoundException();
    if (app.userId !== currentUserId && app.job?.organization?.ownerId !== currentUserId) {
      throw new ForbiddenException('Not authorized to delete this application');
    }
    await this.repo.delete(id);
  }
}
