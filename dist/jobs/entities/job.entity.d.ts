import { Organization } from '../../organizations/entities/organization.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
export declare class Job {
    id: number;
    organizationId: number;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    experienceLevel: string;
    salary: string;
    createdAt: Date;
    updatedAt: Date;
    organization: Organization;
    applications: JobApplication[];
}
