import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ApplicationStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    Interview = "Interview"
}
export declare class JobApplication {
    id: number;
    jobId: number;
    userId: number;
    status: ApplicationStatus;
    coverLetter: string;
    createdAt: Date;
    updatedAt: Date;
    job: Job;
    user: User;
}
