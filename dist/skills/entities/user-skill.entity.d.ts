import { User } from '../../users/entities/user.entity';
import { Skill } from './skill.entity';
export declare class UserSkill {
    id: number;
    userId: number;
    skillId: number;
    user: User;
    skill: Skill;
}
