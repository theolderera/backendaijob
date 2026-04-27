import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class JobsController {
    private readonly service;
    private readonly orgsService;
    constructor(service: JobsService, orgsService: OrganizationsService);
    findAll(): Promise<unknown[]>;
    findPaged(page?: string, pageSize?: string, title?: string, location?: string): Promise<{
        items: unknown[];
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        totalCount: number;
    }>;
    search(title?: string, location?: string): Promise<unknown[]>;
    findByOrg(orgId: number): Promise<unknown[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        description: string;
        location: string;
        employmentType: string;
        experienceLevel: string;
        salary: string;
        organizationId: number;
        organizationName: string;
        companyName: string;
        createdAt: Date;
    }>;
    create(user: CurrentUserPayload, dto: CreateJobDto): Promise<{
        id: number;
        title: string;
        description: string;
        location: string;
        employmentType: string;
        experienceLevel: string;
        salary: string;
        organizationId: number;
        organizationName: string;
        companyName: string;
        createdAt: Date;
    }>;
    update(id: number, user: CurrentUserPayload, dto: UpdateJobDto): Promise<{
        id: number;
        title: string;
        description: string;
        location: string;
        employmentType: string;
        experienceLevel: string;
        salary: string;
        organizationId: number;
        organizationName: string;
        companyName: string;
        createdAt: Date;
    }>;
    remove(id: number, user: CurrentUserPayload): Promise<void>;
}
