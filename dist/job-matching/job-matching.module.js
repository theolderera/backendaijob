"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobMatchingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_entity_1 = require("../jobs/entities/job.entity");
const user_skill_entity_1 = require("../skills/entities/user-skill.entity");
const experience_entity_1 = require("../experience/entities/experience.entity");
const job_matching_controller_1 = require("./job-matching.controller");
const job_matching_service_1 = require("./job-matching.service");
let JobMatchingModule = class JobMatchingModule {
};
exports.JobMatchingModule = JobMatchingModule;
exports.JobMatchingModule = JobMatchingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([job_entity_1.Job, user_skill_entity_1.UserSkill, experience_entity_1.Experience])],
        controllers: [job_matching_controller_1.JobMatchingController],
        providers: [job_matching_service_1.JobMatchingService],
    })
], JobMatchingModule);
//# sourceMappingURL=job-matching.module.js.map