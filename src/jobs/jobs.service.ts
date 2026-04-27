import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly repo: Repository<Job>,
  ) {}

  private formatJob(job: Job) {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      salary: job.salary,
      organizationId: job.organizationId,
      organizationName: job.organization?.name ?? null,
      companyName: job.organization?.name ?? null,
      createdAt: job.createdAt,
    };
  }

  async findAll() {
    const jobs = await this.repo.find({ order: { createdAt: 'DESC' } });
    return jobs.map(this.formatJob.bind(this));
  }

  async findPaged(page: number, pageSize: number, title?: string, location?: string) {
    const where: Record<string, any> = {};
    if (title) where.title = Like(`%${title}%`);
    if (location) where.location = Like(`%${location}%`);

    const [items, totalCount] = await this.repo.findAndCount({
      where: Object.keys(where).length ? where : undefined,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    return {
      items: items.map(this.formatJob.bind(this)),
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      totalCount,
    };
  }

  async search(title?: string, location?: string) {
    const where: Record<string, any> = {};
    if (title) where.title = Like(`%${title}%`);
    if (location) where.location = Like(`%${location}%`);
    const jobs = await this.repo.find({
      where: Object.keys(where).length ? where : undefined,
      order: { createdAt: 'DESC' },
    });
    return jobs.map(this.formatJob.bind(this));
  }

  async findOne(id: number) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException(`Job #${id} not found`);
    return this.formatJob(job);
  }

  async findByOrganization(orgId: number) {
    const jobs = await this.repo.find({
      where: { organizationId: orgId },
      order: { createdAt: 'DESC' },
    });
    return jobs.map(this.formatJob.bind(this));
  }

  async create(organizationId: number, dto: CreateJobDto) {
    const job = this.repo.create({ ...dto, organizationId });
    const saved = await this.repo.save(job);
    return this.formatJob(saved);
  }

  async update(id: number, orgId: number, dto: UpdateJobDto) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException();
    if (job.organizationId !== orgId) throw new ForbiddenException();
    await this.repo.update(id, dto);
    const updated = await this.repo.findOne({ where: { id } });
    return this.formatJob(updated!);
  }

  async remove(id: number, orgId: number) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException();
    if (job.organizationId !== orgId) throw new ForbiddenException();
    await this.repo.delete(id);
  }

  async findAllRaw() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
