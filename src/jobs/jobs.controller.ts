import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { OrganizationsService } from '../organizations/organizations.service';

@ApiTags('Job')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Job')
export class JobsController {
  constructor(
    private readonly service: JobsService,
    private readonly orgsService: OrganizationsService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('paged')
  findPaged(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('title') title?: string,
    @Query('location') location?: string,
  ) {
    return this.service.findPaged(parseInt(page), parseInt(pageSize), title, location);
  }

  @Get('search')
  search(@Query('title') title?: string, @Query('location') location?: string) {
    return this.service.search(title, location);
  }

  @Get('by-organization/:orgId')
  findByOrg(@Param('orgId', ParseIntPipe) orgId: number) {
    return this.service.findByOrganization(orgId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateJobDto) {
    let orgId = dto.organizationId;
    if (!orgId) {
      const org = await this.orgsService.findByOwner(user.id);
      orgId = org.id;
    }
    return this.service.create(orgId, dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateJobDto,
  ) {
    const org = await this.orgsService.findByOwner(user.id);
    return this.service.update(id, org.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    const org = await this.orgsService.findByOwner(user.id);
    return this.service.remove(id, org.id);
  }
}
