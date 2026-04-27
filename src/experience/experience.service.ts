import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience) private readonly repo: Repository<Experience>,
  ) {}

  findByUser(userId: number) {
    return this.repo.find({ where: { userId }, order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const exp = await this.repo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException(`Experience #${id} not found`);
    return exp;
  }

  create(dto: CreateExperienceDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateExperienceDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
