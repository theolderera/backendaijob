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
exports.LanguagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const language_entity_1 = require("./entities/language.entity");
const profile_language_entity_1 = require("./entities/profile-language.entity");
let LanguagesService = class LanguagesService {
    langRepo;
    plRepo;
    constructor(langRepo, plRepo) {
        this.langRepo = langRepo;
        this.plRepo = plRepo;
    }
    findAll() {
        return this.langRepo.find({ order: { name: 'ASC' } });
    }
    findByProfile(profileId) {
        return this.plRepo.find({ where: { profileId }, relations: ['language'] });
    }
    async add(profileId, languageId, level) {
        const lang = await this.langRepo.findOne({ where: { id: languageId } });
        if (!lang)
            throw new common_1.NotFoundException(`Language #${languageId} not found`);
        return this.plRepo.save(this.plRepo.create({ profileId, languageId, level }));
    }
    async update(id, level) {
        await this.plRepo.update(id, { level });
        const pl = await this.plRepo.findOne({ where: { id } });
        if (!pl)
            throw new common_1.NotFoundException();
        return pl;
    }
    async remove(id) {
        await this.plRepo.delete(id);
    }
    async ensureLanguage(code, name) {
        let lang = await this.langRepo.findOne({ where: { code } });
        if (!lang)
            lang = await this.langRepo.save(this.langRepo.create({ code, name }));
        return lang;
    }
};
exports.LanguagesService = LanguagesService;
exports.LanguagesService = LanguagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(language_entity_1.Language)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_language_entity_1.ProfileLanguage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LanguagesService);
//# sourceMappingURL=languages.service.js.map