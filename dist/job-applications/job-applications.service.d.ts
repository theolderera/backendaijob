import { Repository } from 'typeorm';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class JobApplicationsService {
    private readonly repo;
    private readonly notificationsService;
    constructor(repo: Repository<JobApplication>, notificationsService: NotificationsService);
    findByUser(userId: number): Promise<JobApplication[]>;
    findByJob(jobId: number): Promise<JobApplication[]>;
    apply(userId: number, jobId: number, coverLetter?: string): Promise<JobApplication>;
    updateStatus(id: number, status: ApplicationStatus): Promise<JobApplication>;
    remove(id: number): Promise<void>;
}
