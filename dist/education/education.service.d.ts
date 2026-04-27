import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
export declare class EducationService {
    private readonly repo;
    constructor(repo: Repository<Education>);
    findByUser(userId: number): Promise<Education[]>;
    findOne(id: number): Promise<Education>;
    create(dto: CreateEducationDto): Promise<Education>;
    update(id: number, dto: UpdateEducationDto): Promise<Education>;
    remove(id: number): Promise<void>;
}
