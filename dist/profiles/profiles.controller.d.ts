import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    findByUser(userId: number): Promise<import("./entities/profile.entity").Profile | null>;
    create(user: CurrentUserPayload, dto: CreateProfileDto): Promise<import("./entities/profile.entity").Profile>;
    update(id: number, dto: UpdateProfileDto): Promise<import("./entities/profile.entity").Profile>;
}
