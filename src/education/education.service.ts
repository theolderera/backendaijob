import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education) private readonly repo: Repository<Education>,
  ) {}

  findByUser(userId: number) {
    return this.repo.find({ where: { userId }, order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const edu = await this.repo.findOne({ where: { id } });
    if (!edu) throw new NotFoundException(`Education #${id} not found`);
    return edu;
  }

  create(dto: CreateEducationDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateEducationDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
