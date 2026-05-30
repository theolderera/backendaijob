import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgMember } from './entities/org-member.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { OrganizationsService } from './organizations.service';

@ApiTags('OrganizationMember')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('OrganizationMember')
export class OrgMemberController {
  constructor(
    @InjectRepository(OrgMember) private readonly repo: Repository<OrgMember>,
    private readonly service: OrganizationsService,
  ) {}

  @Get('by-organization/:orgId')
  findByOrg(@Param('orgId', ParseIntPipe) orgId: number) {
    return this.repo.find({ where: { organizationId: orgId }, relations: ['user'] });
  }

  @Post()
  sendRequest(@Body() dto: { organizationId: number; userId?: number; role?: string }, @CurrentUser() user: CurrentUserPayload) {
    return this.service.sendJoinRequest(dto.organizationId, dto.userId ?? user.id, dto.role);
  }

  @Put(':id/respond')
  respond(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.respondJoinRequest(id, user.id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.removeMember(id, user.id);
  }
}
