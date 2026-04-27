import { EducationService } from './education.service';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
export declare class EducationController {
    private readonly service;
    constructor(service: EducationService);
    findByUser(userId: number): Promise<import("./entities/education.entity").Education[]>;
    create(dto: CreateEducationDto): Promise<import("./entities/education.entity").Education>;
    update(id: number, dto: UpdateEducationDto): Promise<import("./entities/education.entity").Education>;
    remove(id: number): Promise<void>;
}
