import {
  Controller, Get, Post, Delete, Patch, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobApplicationsService } from './job-applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { ApplicationStatus } from './entities/job-application.entity';

@ApiTags('JobApplication')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('JobApplication')
export class JobApplicationsController {
  constructor(private readonly service: JobApplicationsService) {}

  @Get('by-user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findByUser(userId);
  }

  @Get('by-job/:jobId')
  findByJob(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.service.findByJob(jobId);
  }

  @Get('by-organization/:orgId')
  findByOrganization(@Param('orgId', ParseIntPipe) orgId: number) {
    return this.service.findByOrganization(orgId);
  }

  @Post()
  apply(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: { jobId: number; userId?: number; coverLetter?: string },
  ) {
    return this.service.apply(dto.userId ?? user.id, dto.jobId, dto.coverLetter);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: ApplicationStatus },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateStatus(id, dto.status, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.remove(id, user.id);
  }
}
