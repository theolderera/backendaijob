import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { SkillsModule } from './skills/skills.module';
import { LanguagesModule } from './languages/languages.module';
import { PostsModule } from './posts/posts.module';
import { ConnectionsModule } from './connections/connections.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JobsModule } from './jobs/jobs.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { JobMatchingModule } from './job-matching/job-matching.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';

import { User } from './users/entities/user.entity';
import { Profile } from './profiles/entities/profile.entity';
import { Experience } from './experience/entities/experience.entity';
import { Education } from './education/entities/education.entity';
import { Skill } from './skills/entities/skill.entity';
import { UserSkill } from './skills/entities/user-skill.entity';
import { Language } from './languages/entities/language.entity';
import { ProfileLanguage } from './languages/entities/profile-language.entity';
import { Post } from './posts/entities/post.entity';
import { Like } from './posts/entities/like.entity';
import { Comment } from './posts/entities/comment.entity';
import { Connection } from './connections/entities/connection.entity';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './messages/entities/message.entity';
import { Notification } from './notifications/entities/notification.entity';
import { Job } from './jobs/entities/job.entity';
import { JobApplication } from './job-applications/entities/job-application.entity';
import { Organization } from './organizations/entities/organization.entity';
import { OrgMember } from './organizations/entities/org-member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');
        const entities = [
          User, Profile, Experience, Education,
          Skill, UserSkill, Language, ProfileLanguage,
          Post, Like, Comment,
          Connection, Conversation, Message,
          Notification, Job, JobApplication,
          Organization, OrgMember,
        ];

        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities,
            synchronize: true,
            ssl: { rejectUnauthorized: false },
            logging: false,
          };
        }

        return {
          type: 'better-sqlite3' as any,
          database: config.get<string>('DB_PATH', './database.sqlite'),
          entities,
          synchronize: true,
          logging: false,
        };
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    AuthModule,
    UsersModule,
    ProfilesModule,
    ExperienceModule,
    EducationModule,
    SkillsModule,
    LanguagesModule,
    PostsModule,
    ConnectionsModule,
    ConversationsModule,
    MessagesModule,
    NotificationsModule,
    JobsModule,
    JobApplicationsModule,
    JobMatchingModule,
    OrganizationsModule,
    UploadModule,
    AiModule,
  ],
})
export class AppModule {}
