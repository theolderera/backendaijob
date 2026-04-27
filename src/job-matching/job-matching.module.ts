import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../jobs/entities/job.entity';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
import { JobMatchingController } from './job-matching.controller';
import { JobMatchingService } from './job-matching.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, UserSkill, Experience])],
  controllers: [JobMatchingController],
  providers: [JobMatchingService],
})
export class JobMatchingModule {}
