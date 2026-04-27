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
exports.JobMatchingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const job_matching_service_1 = require("./job-matching.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let JobMatchingController = class JobMatchingController {
    service;
    constructor(service) {
        this.service = service;
    }
    getRecommended(userId) {
        return this.service.getRecommended(userId);
    }
    getMatchExplanation(userId, jobId) {
        return this.service.getMatchExplanation(userId, jobId);
    }
};
exports.JobMatchingController = JobMatchingController;
__decorate([
    (0, common_1.Get)('recommended-jobs/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], JobMatchingController.prototype, "getRecommended", null);
__decorate([
    (0, common_1.Get)('match-explanation/:userId/:jobId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], JobMatchingController.prototype, "getMatchExplanation", null);
exports.JobMatchingController = JobMatchingController = __decorate([
    (0, swagger_1.ApiTags)('JobMatching'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('JobMatching'),
    __metadata("design:paramtypes", [job_matching_service_1.JobMatchingService])
], JobMatchingController);
//# sourceMappingURL=job-matching.controller.js.map