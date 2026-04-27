import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobMatchingService } from './job-matching.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('JobMatching')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('JobMatching')
export class JobMatchingController {
  constructor(private readonly service: JobMatchingService) {}

  @Get('recommended-jobs/:userId')
  getRecommended(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.getRecommended(userId);
  }

  @Get('match-explanation/:userId/:jobId')
  getMatchExplanation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    return this.service.getMatchExplanation(userId, jobId);
  }
}
