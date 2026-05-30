import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { AddMemberDto } from './dto/organization-member.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class OrganizationMembersService {
  constructor(
    @InjectRepository(OrganizationMember) private readonly repo: Repository<OrganizationMember>,
    private readonly notificationsService: NotificationsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async findByOrganization(orgId: number) {
    return this.repo.find({ where: { organizationId: orgId }, order: { joinedAt: 'DESC' } });
  }

  async sendRequest(dto: AddMemberDto, currentUserId: number) {
    // Both user can request to join OR org owner can invite. Let's simplify: user requests to join.
    if (dto.userId !== currentUserId) {
      throw new ForbiddenException('You can only request for yourself');
    }

    const org = await this.organizationsService.findOne(dto.organizationId);
    if (!org) throw new NotFoundException('Organization not found');

    const existing = await this.repo.findOne({ where: { organizationId: dto.organizationId, userId: dto.userId } });
    if (existing) throw new ConflictException('Already a member or requested');

    const member = this.repo.create({
      organizationId: dto.organizationId,
      userId: dto.userId,
      role: dto.role || 'Employee',
      status: 'Pending',
    });

    const saved = await this.repo.save(member);

    // Notify owner
    await this.notificationsService.create(
      org.ownerId,
      'New Organization Request',
      `A user requested to join your organization.`,
      'organization',
      `/profile/${dto.userId}`
    );

    return saved;
  }

  async respond(id: number, status: string, currentUserId: number) {
    const member = await this.repo.findOne({ where: { id }, relations: ['organization'] });
    if (!member) throw new NotFoundException();

    if (member.organization.ownerId !== currentUserId) {
      throw new ForbiddenException('Not your organization');
    }

    member.status = status;
    const saved = await this.repo.save(member);

    if (status === 'Accepted') {
      await this.notificationsService.create(
        member.userId,
        'Organization Request Accepted',
        `Your request to join ${member.organization.name} was accepted.`,
        'organization',
        `/organizations/${member.organizationId}`
      );
    }

    return saved;
  }

  async remove(id: number, currentUserId: number) {
    const member = await this.repo.findOne({ where: { id }, relations: ['organization'] });
    if (!member) throw new NotFoundException();

    if (member.userId !== currentUserId && member.organization.ownerId !== currentUserId) {
      throw new ForbiddenException();
    }

    await this.repo.delete(id);
  }
}
