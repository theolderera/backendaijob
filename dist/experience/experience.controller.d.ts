import { ExperienceService } from './experience.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
export declare class ExperienceController {
    private readonly service;
    constructor(service: ExperienceService);
    findByUser(userId: number): Promise<import("./entities/experience.entity").Experience[]>;
    create(dto: CreateExperienceDto): Promise<import("./entities/experience.entity").Experience>;
    update(id: number, dto: UpdateExperienceDto): Promise<import("./entities/experience.entity").Experience>;
    remove(id: number): Promise<void>;
}
