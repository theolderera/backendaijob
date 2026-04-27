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
exports.ConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const connection_entity_1 = require("./entities/connection.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let ConnectionsService = class ConnectionsService {
    repo;
    notificationsService;
    constructor(repo, notificationsService) {
        this.repo = repo;
        this.notificationsService = notificationsService;
    }
    formatConn(conn, currentUserId) {
        const isRequester = conn.requesterId === currentUserId;
        const other = isRequester ? conn.addressee : conn.requester;
        return {
            id: conn.id,
            requesterId: conn.requesterId,
            addresseeId: conn.addresseeId,
            status: conn.status,
            createdAt: conn.createdAt,
            otherUser: other
                ? {
                    id: other.id,
                    fullName: other.fullName,
                    imageUrl: other.profile?.avatarUrl ?? null,
                    headline: other.profile?.headline ?? null,
                }
                : null,
        };
    }
    async findMy(userId) {
        const conns = await this.repo.find({
            where: [
                { requesterId: userId, status: connection_entity_1.ConnectionStatus.Accepted },
                { addresseeId: userId, status: connection_entity_1.ConnectionStatus.Accepted },
            ],
            relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
        });
        return conns.map((c) => this.formatConn(c, userId));
    }
    async findPending(userId) {
        const conns = await this.repo.find({
            where: { addresseeId: userId, status: connection_entity_1.ConnectionStatus.Pending },
            relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
        });
        return conns.map((c) => this.formatConn(c, userId));
    }
    async findAll(userId) {
        const conns = await this.repo.find({
            where: [{ requesterId: userId }, { addresseeId: userId }],
            relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
        });
        return conns.map((c) => this.formatConn(c, userId));
    }
    async send(requesterId, addresseeId) {
        if (requesterId === addresseeId) {
            throw new common_1.BadRequestException('Cannot connect with yourself');
        }
        const existing = await this.repo.findOne({
            where: [
                { requesterId, addresseeId },
                { requesterId: addresseeId, addresseeId: requesterId },
            ],
        });
        if (existing)
            throw new common_1.ConflictException('Connection already exists');
        const conn = this.repo.create({ requesterId, addresseeId, status: connection_entity_1.ConnectionStatus.Pending });
        const saved = await this.repo.save(conn);
        await this.notificationsService.create(addresseeId, 'New connection request', 'You have a new connection request.', 'connection', `/network`);
        return saved;
    }
    async respond(id, userId, accept) {
        const conn = await this.repo.findOne({ where: { id } });
        if (!conn)
            throw new common_1.NotFoundException();
        conn.status = accept ? connection_entity_1.ConnectionStatus.Accepted : connection_entity_1.ConnectionStatus.Rejected;
        const saved = await this.repo.save(conn);
        if (accept) {
            await this.notificationsService.create(conn.requesterId, 'Connection accepted', 'Your connection request was accepted.', 'connection', `/profile/${userId}`);
        }
        return saved;
    }
    async remove(id) {
        await this.repo.delete(id);
    }
};
exports.ConnectionsService = ConnectionsService;
exports.ConnectionsService = ConnectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(connection_entity_1.Connection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ConnectionsService);
//# sourceMappingURL=connections.service.js.map