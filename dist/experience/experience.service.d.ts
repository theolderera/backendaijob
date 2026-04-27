import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
export declare class ExperienceService {
    private readonly repo;
    constructor(repo: Repository<Experience>);
    findByUser(userId: number): Promise<Experience[]>;
    findOne(id: number): Promise<Experience>;
    create(dto: CreateExperienceDto): Promise<Experience>;
    update(id: number, dto: UpdateExperienceDto): Promise<Experience>;
    remove(id: number): Promise<void>;
}
