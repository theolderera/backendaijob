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
exports.ProfileLanguage = void 0;
const typeorm_1 = require("typeorm");
const profile_entity_1 = require("../../profiles/entities/profile.entity");
const language_entity_1 = require("./language.entity");
let ProfileLanguage = class ProfileLanguage {
    id;
    profileId;
    languageId;
    level;
    profile;
    language;
};
exports.ProfileLanguage = ProfileLanguage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProfileLanguage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProfileLanguage.prototype, "profileId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProfileLanguage.prototype, "languageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Intermediate' }),
    __metadata("design:type", String)
], ProfileLanguage.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_entity_1.Profile, (p) => p.profileLanguages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'profileId' }),
    __metadata("design:type", profile_entity_1.Profile)
], ProfileLanguage.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => language_entity_1.Language, (l) => l.profileLanguages, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'languageId' }),
    __metadata("design:type", language_entity_1.Language)
], ProfileLanguage.prototype, "language", void 0);
exports.ProfileLanguage = ProfileLanguage = __decorate([
    (0, typeorm_1.Entity)('profile_languages')
], ProfileLanguage);
//# sourceMappingURL=profile-language.entity.js.map