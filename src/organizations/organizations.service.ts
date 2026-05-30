import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrgMember } from './entities/org-member.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly repo: Repository<Organization>,
    @InjectRepository(OrgMember) private readonly memberRepo: Repository<OrgMember>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
  ) {}

  async findAll(search?: string) {
    const whereCondition = search ? { name: ILike(`%${search}%`) } : {};
    const orgs = await this.repo.find({ where: whereCondition, relations: ['owner'] });
    
    // Add jobsCount
    return Promise.all(orgs.map(async (org) => {
      const jobsCount = await this.jobRepo.count({ where: { organizationId: org.id } });
      return { ...org, jobsCount };
    }));
  }

  async findOne(id: number) {
    const org = await this.repo.findOne({ where: { id }, relations: ['owner'] });
    if (!org) throw new NotFoundException(`Organization #${id} not found`);
    const jobsCount = await this.jobRepo.count({ where: { organizationId: org.id } });
    return { ...org, jobsCount };
  }

  async findByOwner(ownerId: number) {
    const org = await this.repo.findOne({ where: { ownerId }, relations: ['owner'] });
    if (!org) throw new NotFoundException('You do not have an organization');
    const jobsCount = await this.jobRepo.count({ where: { organizationId: org.id } });
    return { ...org, jobsCount };
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

  // Member Management
  async sendJoinRequest(orgId: number, userId: number, role?: string) {
    const org = await this.repo.findOne({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');

    const existing = await this.memberRepo.findOne({ where: { organizationId: orgId, userId } });
    if (existing) throw new ForbiddenException('Already requested or joined');

    const member = this.memberRepo.create({
      organizationId: orgId,
      userId,
      role: role || 'Member',
      status: 'Pending',
    });
    return this.memberRepo.save(member);
  }

  async respondJoinRequest(memberId: number, ownerId: number, status: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId }, relations: ['organization'] });
    if (!member) throw new NotFoundException('Member request not found');
    if (member.organization.ownerId !== ownerId) throw new ForbiddenException('Not your organization');

    member.status = status;
    return this.memberRepo.save(member);
  }

  async removeMember(memberId: number, currentUserId: number) {
    const member = await this.memberRepo.findOne({ where: { id: memberId }, relations: ['organization'] });
    if (!member) throw new NotFoundException('Member not found');
    
    if (member.userId !== currentUserId && member.organization.ownerId !== currentUserId) {
      throw new ForbiddenException('Cannot remove this member');
    }
    
    await this.memberRepo.delete(memberId);
  }
}
