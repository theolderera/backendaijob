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
exports.Connection = exports.ConnectionStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Pending"] = "Pending";
    ConnectionStatus["Accepted"] = "Accepted";
    ConnectionStatus["Rejected"] = "Rejected";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
let Connection = class Connection {
    id;
    requesterId;
    addresseeId;
    status;
    createdAt;
    updatedAt;
    requester;
    addressee;
};
exports.Connection = Connection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Connection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Connection.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Connection.prototype, "addresseeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: ConnectionStatus.Pending }),
    __metadata("design:type", String)
], Connection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Connection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Connection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sentConnections, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'requesterId' }),
    __metadata("design:type", user_entity_1.User)
], Connection.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.receivedConnections, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'addresseeId' }),
    __metadata("design:type", user_entity_1.User)
], Connection.prototype, "addressee", void 0);
exports.Connection = Connection = __decorate([
    (0, typeorm_1.Entity)('connections'),
    (0, typeorm_1.Unique)(['requesterId', 'addresseeId'])
], Connection);
//# sourceMappingURL=connection.entity.js.map