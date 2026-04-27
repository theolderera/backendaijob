import {
  Injectable, NotFoundException, ConflictException,
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

  async updateStatus(id: number, status: ApplicationStatus) {
    const app = await this.repo.findOne({ where: { id }, relations: ['job'] });
    if (!app) throw new NotFoundException();
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

  async remove(id: number) {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException();
    await this.repo.delete(id);
  }
}
