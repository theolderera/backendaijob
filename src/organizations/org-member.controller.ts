import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgMember } from './entities/org-member.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('OrganizationMember')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('OrganizationMember')
export class OrgMemberController {
  constructor(
    @InjectRepository(OrgMember) private readonly repo: Repository<OrgMember>,
  ) {}

  @Get('by-organization/:orgId')
  findByOrg(@Param('orgId', ParseIntPipe) orgId: number) {
    return this.repo.find({ where: { organizationId: orgId }, relations: ['user'] });
  }
}
