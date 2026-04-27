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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("./entities/profile.entity");
let ProfilesService = class ProfilesService {
    profileRepo;
    constructor(profileRepo) {
        this.profileRepo = profileRepo;
    }
    async findByUserId(userId) {
        return this.profileRepo.findOne({
            where: { userId },
            relations: ['user', 'profileLanguages', 'profileLanguages.language'],
        });
    }
    async findById(id) {
        const profile = await this.profileRepo.findOne({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException(`Profile #${id} not found`);
        return profile;
    }
    async create(userId, dto) {
        const existing = await this.profileRepo.findOne({ where: { userId } });
        if (existing)
            return this.update(existing.id, dto);
        const profile = this.profileRepo.create({ ...dto, userId });
        return this.profileRepo.save(profile);
    }
    async update(id, dto) {
        await this.profileRepo.update(id, dto);
        return this.findById(id);
    }
    async upsertByUserId(userId, dto) {
        const existing = await this.profileRepo.findOne({ where: { userId } });
        if (existing) {
            await this.profileRepo.update(existing.id, dto);
            return this.findById(existing.id);
        }
        const profile = this.profileRepo.create({ ...dto, userId });
        return this.profileRepo.save(profile);
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map