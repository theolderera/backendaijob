import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
    findAll(): Promise<import("./entities/organization.entity").Organization[]>;
    findMine(user: CurrentUserPayload): Promise<import("./entities/organization.entity").Organization>;
    findOne(id: number): Promise<import("./entities/organization.entity").Organization>;
    create(user: CurrentUserPayload, dto: CreateOrganizationDto): Promise<import("./entities/organization.entity").Organization>;
    update(id: number, user: CurrentUserPayload, dto: UpdateOrganizationDto): Promise<import("./entities/organization.entity").Organization>;
}
