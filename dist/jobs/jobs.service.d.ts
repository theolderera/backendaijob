import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
export declare class JobsService {
    private readonly repo;
    constructor(repo: Repository<Job>);
    private formatJob;
    findAll(): Promise<unknown[]>;
    findPaged(page: number, pageSize: number, title?: string, location?: string): Promise<{
        items: unknown[];
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
        totalCount: number;
    }>;
    search(title?: string, location?: string): Promise<unknown[]>;
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
    findByOrganization(orgId: number): Promise<unknown[]>;
    create(organizationId: number, dto: CreateJobDto): Promise<{
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
    update(id: number, orgId: number, dto: UpdateJobDto): Promise<{
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
    remove(id: number, orgId: number): Promise<void>;
    findAllRaw(): Promise<Job[]>;
}
