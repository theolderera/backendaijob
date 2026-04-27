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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("../messages/entities/message.entity");
let ConversationsService = class ConversationsService {
    repo;
    msgRepo;
    constructor(repo, msgRepo) {
        this.repo = repo;
        this.msgRepo = msgRepo;
    }
    async enrichConversation(conv, userId) {
        const unreadCount = await this.msgRepo.count({
            where: { conversationId: conv.id, isRead: false, senderId: userId === conv.user1Id ? conv.user2Id : conv.user1Id },
        });
        const lastMsg = await this.msgRepo.findOne({
            where: { conversationId: conv.id },
            order: { createdAt: 'DESC' },
        });
        return {
            id: conv.id,
            user1Id: conv.user1Id,
            user2Id: conv.user2Id,
            createdAt: conv.createdAt,
            unreadCount,
            lastMessagePreview: lastMsg?.content ?? null,
            lastMessageAt: lastMsg?.createdAt ?? null,
            user1: conv.user1 ? { id: conv.user1.id, fullName: conv.user1.fullName } : null,
            user2: conv.user2 ? { id: conv.user2.id, fullName: conv.user2.fullName } : null,
        };
    }
    async findByUser(userId) {
        const convs = await this.repo.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            relations: ['user1', 'user2'],
            order: { createdAt: 'DESC' },
        });
        return Promise.all(convs.map((c) => this.enrichConversation(c, userId)));
    }
    async findOrCreate(user1Id, otherUserId) {
        const user2Id = otherUserId;
        const existing = await this.repo.findOne({
            where: [
                { user1Id, user2Id },
                { user1Id: user2Id, user2Id: user1Id },
            ],
            relations: ['user1', 'user2'],
        });
        if (existing)
            return this.enrichConversation(existing, user1Id);
        const conv = await this.repo.save(this.repo.create({ user1Id, user2Id }));
        const full = await this.repo.findOne({
            where: { id: conv.id },
            relations: ['user1', 'user2'],
        });
        return this.enrichConversation(full, user1Id);
    }
    async remove(id, userId) {
        const conv = await this.repo.findOne({ where: { id } });
        if (!conv)
            throw new common_1.NotFoundException();
        if (conv.user1Id !== userId && conv.user2Id !== userId)
            throw new common_1.ForbiddenException();
        await this.repo.delete(id);
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map