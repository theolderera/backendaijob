import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly repo: Repository<Organization>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['owner'] });
  }

  async findOne(id: number) {
    const org = await this.repo.findOne({ where: { id }, relations: ['owner'] });
    if (!org) throw new NotFoundException(`Organization #${id} not found`);
    return org;
  }

  async findByOwner(ownerId: number) {
    const org = await this.repo.findOne({ where: { ownerId }, relations: ['owner'] });
    if (!org) throw new NotFoundException('You do not have an organization');
    return org;
  }

  async create(ownerId: number, dto: CreateOrganizationDto) {
    const org = this.repo.create({ ...dto, ownerId });
    return this.repo.save(org);
  }

  async update(id: number, ownerId: number, dto: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    if (org.ownerId !== ownerId) throw new ForbiddenException('Not your organization');
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
