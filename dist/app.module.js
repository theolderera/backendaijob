"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const profiles_module_1 = require("./profiles/profiles.module");
const experience_module_1 = require("./experience/experience.module");
const education_module_1 = require("./education/education.module");
const skills_module_1 = require("./skills/skills.module");
const languages_module_1 = require("./languages/languages.module");
const posts_module_1 = require("./posts/posts.module");
const connections_module_1 = require("./connections/connections.module");
const conversations_module_1 = require("./conversations/conversations.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const jobs_module_1 = require("./jobs/jobs.module");
const job_applications_module_1 = require("./job-applications/job-applications.module");
const job_matching_module_1 = require("./job-matching/job-matching.module");
const organizations_module_1 = require("./organizations/organizations.module");
const upload_module_1 = require("./upload/upload.module");
const ai_module_1 = require("./ai/ai.module");
const user_entity_1 = require("./users/entities/user.entity");
const profile_entity_1 = require("./profiles/entities/profile.entity");
const experience_entity_1 = require("./experience/entities/experience.entity");
const education_entity_1 = require("./education/entities/education.entity");
const skill_entity_1 = require("./skills/entities/skill.entity");
const user_skill_entity_1 = require("./skills/entities/user-skill.entity");
const language_entity_1 = require("./languages/entities/language.entity");
const profile_language_entity_1 = require("./languages/entities/profile-language.entity");
const post_entity_1 = require("./posts/entities/post.entity");
const like_entity_1 = require("./posts/entities/like.entity");
const comment_entity_1 = require("./posts/entities/comment.entity");
const connection_entity_1 = require("./connections/entities/connection.entity");
const conversation_entity_1 = require("./conversations/entities/conversation.entity");
const message_entity_1 = require("./messages/entities/message.entity");
const notification_entity_1 = require("./notifications/entities/notification.entity");
const job_entity_1 = require("./jobs/entities/job.entity");
const job_application_entity_1 = require("./job-applications/entities/job-application.entity");
const organization_entity_1 = require("./organizations/entities/organization.entity");
const org_member_entity_1 = require("./organizations/entities/org-member.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'better-sqlite3',
                    database: config.get('DB_PATH', './database.sqlite'),
                    entities: [
                        user_entity_1.User, profile_entity_1.Profile, experience_entity_1.Experience, education_entity_1.Education,
                        skill_entity_1.Skill, user_skill_entity_1.UserSkill, language_entity_1.Language, profile_language_entity_1.ProfileLanguage,
                        post_entity_1.Post, like_entity_1.Like, comment_entity_1.Comment,
                        connection_entity_1.Connection, conversation_entity_1.Conversation, message_entity_1.Message,
                        notification_entity_1.Notification, job_entity_1.Job, job_application_entity_1.JobApplication,
                        organization_entity_1.Organization, org_member_entity_1.OrgMember,
                    ],
                    synchronize: true,
                    logging: false,
                }),
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            experience_module_1.ExperienceModule,
            education_module_1.EducationModule,
            skills_module_1.SkillsModule,
            languages_module_1.LanguagesModule,
            posts_module_1.PostsModule,
            connections_module_1.ConnectionsModule,
            conversations_module_1.ConversationsModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            jobs_module_1.JobsModule,
            job_applications_module_1.JobApplicationsModule,
            job_matching_module_1.JobMatchingModule,
            organizations_module_1.OrganizationsModule,
            upload_module_1.UploadModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map