import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { AddMemberDto, RespondMemberDto } from './dto/organization-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('OrganizationMember')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('OrganizationMember')
export class OrganizationMembersController {
  constructor(private readonly service: OrganizationMembersService) {}

  @Get('by-organization/:orgId')
  findByOrganization(@Param('orgId', ParseIntPipe) orgId: number) {
    return this.service.findByOrganization(orgId);
  }

  @Post()
  sendRequest(@Body() dto: AddMemberDto, @CurrentUser() user: CurrentUserPayload) {
    return this.service.sendRequest(dto, user.id);
  }

  @Put(':id/respond')
  respond(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RespondMemberDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.respond(id, dto.status, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user.id);
  }
}
