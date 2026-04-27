import { JobApplicationsService } from './job-applications.service';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { ApplicationStatus } from './entities/job-application.entity';
export declare class JobApplicationsController {
    private readonly service;
    constructor(service: JobApplicationsService);
    findByUser(userId: number): Promise<import("./entities/job-application.entity").JobApplication[]>;
    findByJob(jobId: number): Promise<import("./entities/job-application.entity").JobApplication[]>;
    apply(user: CurrentUserPayload, dto: {
        jobId: number;
        userId?: number;
        coverLetter?: string;
    }): Promise<import("./entities/job-application.entity").JobApplication>;
    updateStatus(id: number, dto: {
        status: ApplicationStatus;
    }): Promise<import("./entities/job-application.entity").JobApplication>;
    remove(id: number): Promise<void>;
}
