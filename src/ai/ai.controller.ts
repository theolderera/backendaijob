import {
  Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('Ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Post('ask')
  ask(@Body() dto: { question: string }, @Req() req: any) {
    const userId = req.user.id;
    return this.service.ask(dto.question, userId);
  }

  @Post('analyze-cv')
  analyzeCv(@Body() dto: { userId?: number; cvText?: string; cvFileUrl?: string }) {
    return this.service.analyzeCv(dto);
  }

  @Get('skill-gap/:userId/:jobId')
  skillGap(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    return this.service.skillGap(userId, jobId);
  }

  @Post('improve-job')
  improveJob(@Body() dto: { title?: string; description?: string; location?: string }) {
    return this.service.improveJob(dto);
  }

  @Post('draft-cover-letter')
  draftCoverLetter(
    @Body() dto: { userId: number; jobId: number; tone?: string; extraContext?: string },
  ) {
    return this.service.draftCoverLetter(dto);
  }

  @Post('draft-message')
  draftMessage(
    @Body() dto: { userId: number; recipientName?: string; purpose?: string; tone?: string },
  ) {
    return this.service.draftMessage(dto);
  }
}
