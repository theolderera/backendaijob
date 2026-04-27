import { SkillsService } from './skills.service';
declare class AddSkillDto {
    userId: number;
    skillId: number;
}
export declare class SkillController {
    private readonly service;
    constructor(service: SkillsService);
    findAll(): Promise<import("./entities/skill.entity").Skill[]>;
    search(name: string): Promise<import("./entities/skill.entity").Skill[]>;
}
export declare class SkillsController {
    private readonly service;
    constructor(service: SkillsService);
    findByUser(userId: number): Promise<import("./entities/user-skill.entity").UserSkill[]>;
    add(dto: AddSkillDto): Promise<import("./entities/user-skill.entity").UserSkill | null>;
    remove(userId: number, skillId: number): Promise<void>;
}
export {};
