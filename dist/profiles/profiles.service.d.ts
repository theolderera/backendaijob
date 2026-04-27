import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
export declare class ProfilesService {
    private readonly profileRepo;
    constructor(profileRepo: Repository<Profile>);
    findByUserId(userId: number): Promise<Profile | null>;
    findById(id: number): Promise<Profile>;
    create(userId: number, dto: CreateProfileDto): Promise<Profile>;
    update(id: number, dto: UpdateProfileDto): Promise<Profile>;
    upsertByUserId(userId: number, dto: UpdateProfileDto): Promise<Profile>;
}
