"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const profile_entity_1 = require("../../profiles/entities/profile.entity");
const post_entity_1 = require("../../posts/entities/post.entity");
const connection_entity_1 = require("../../connections/entities/connection.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
const message_entity_1 = require("../../messages/entities/message.entity");
const job_application_entity_1 = require("../../job-applications/entities/job-application.entity");
const organization_entity_1 = require("../../organizations/entities/organization.entity");
var UserRole;
(function (UserRole) {
    UserRole["Candidate"] = "Candidate";
    UserRole["Organization"] = "Organization";
    UserRole["Admin"] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    fullName;
    email;
    phoneNumber;
    passwordHash;
    role;
    passwordResetToken;
    passwordResetExpires;
    createdAt;
    updatedAt;
    profile;
    posts;
    sentConnections;
    receivedConnections;
    notifications;
    messages;
    jobApplications;
    organization;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: UserRole.Candidate }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_entity_1.Profile, (profile) => profile.user, { nullable: true }),
    __metadata("design:type", profile_entity_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.Post, (post) => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => connection_entity_1.Connection, (conn) => conn.requester),
    __metadata("design:type", Array)
], User.prototype, "sentConnections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => connection_entity_1.Connection, (conn) => conn.addressee),
    __metadata("design:type", Array)
], User.prototype, "receivedConnections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (n) => n.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (m) => m.sender),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_application_entity_1.JobApplication, (ja) => ja.user),
    __metadata("design:type", Array)
], User.prototype, "jobApplications", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => organization_entity_1.Organization, (org) => org.owner, { nullable: true }),
    __metadata("design:type", organization_entity_1.Organization)
], User.prototype, "organization", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map