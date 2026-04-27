import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { UserSkill } from './entities/user-skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private readonly skillRepo: Repository<Skill>,
    @InjectRepository(UserSkill) private readonly userSkillRepo: Repository<UserSkill>,
  ) {}

  findAll() {
    return this.skillRepo.find({ order: { name: 'ASC' } });
  }

  search(name: string) {
    return this.skillRepo.find({
      where: { name: Like(`%${name}%`) },
      order: { name: 'ASC' },
      take: 20,
    });
  }

  findByUser(userId: number) {
    return this.userSkillRepo.find({ where: { userId }, relations: ['skill'] });
  }

  async addToUser(userId: number, skillId: number) {
    const skill = await this.skillRepo.findOne({ where: { id: skillId } });
    if (!skill) throw new NotFoundException(`Skill #${skillId} not found`);

    const existing = await this.userSkillRepo.findOne({ where: { userId, skillId } });
    if (existing) return existing;

    return this.userSkillRepo.save(this.userSkillRepo.create({ userId, skillId }));
  }

  async removeFromUser(userId: number, skillId: number) {
    await this.userSkillRepo.delete({ userId, skillId });
  }

  async ensureSkill(name: string): Promise<Skill> {
    let skill = await this.skillRepo.findOne({ where: { name } });
    if (!skill) skill = await this.skillRepo.save(this.skillRepo.create({ name }));
    return skill;
  }
}
