import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { UserSkill } from './entities/user-skill.entity';
export declare class SkillsService {
    private readonly skillRepo;
    private readonly userSkillRepo;
    constructor(skillRepo: Repository<Skill>, userSkillRepo: Repository<UserSkill>);
    findAll(): Promise<Skill[]>;
    search(name: string): Promise<Skill[]>;
    findByUser(userId: number): Promise<UserSkill[]>;
    addToUser(userId: number, skillId: number): Promise<UserSkill>;
    removeFromUser(userId: number, skillId: number): Promise<void>;
    ensureSkill(name: string): Promise<Skill>;
}
