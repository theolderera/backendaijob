import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
export declare class OrganizationsService {
    private readonly repo;
    constructor(repo: Repository<Organization>);
    findAll(): Promise<Organization[]>;
    findOne(id: number): Promise<Organization>;
    findByOwner(ownerId: number): Promise<Organization>;
    create(ownerId: number, dto: CreateOrganizationDto): Promise<Organization>;
    update(id: number, ownerId: number, dto: UpdateOrganizationDto): Promise<Organization>;
}
