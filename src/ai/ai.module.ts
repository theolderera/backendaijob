import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Job } from '../jobs/entities/job.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserSkill, Experience, Job, Profile, User]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
