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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const like_entity_1 = require("./entities/like.entity");
const comment_entity_1 = require("./entities/comment.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    postRepo;
    likeRepo;
    commentRepo;
    notificationsService;
    constructor(postRepo, likeRepo, commentRepo, notificationsService) {
        this.postRepo = postRepo;
        this.likeRepo = likeRepo;
        this.commentRepo = commentRepo;
        this.notificationsService = notificationsService;
    }
    async toFeedItem(post, currentUserId) {
        const likeCount = await this.likeRepo.count({ where: { postId: post.id } });
        const commentCount = await this.commentRepo.count({ where: { postId: post.id } });
        const likedByMe = !!(await this.likeRepo.findOne({
            where: { postId: post.id, userId: currentUserId },
        }));
        const repostCount = await this.postRepo.count({ where: { repostOfId: post.id } });
        return {
            id: post.id,
            userId: post.userId,
            organizationId: post.organizationId,
            content: post.content,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt,
            likeCount,
            likedByMe,
            repostCount,
            commentCount,
            authorName: post.user?.fullName ?? 'Unknown',
            authorImageUrl: post.user?.profile?.avatarUrl ?? null,
        };
    }
    async getFeed(currentUserId) {
        const posts = await this.postRepo.find({
            order: { createdAt: 'DESC' },
            relations: ['user', 'user.profile'],
            take: 50,
        });
        return Promise.all(posts.map((p) => this.toFeedItem(p, currentUserId)));
    }
    async findOne(id, currentUserId) {
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['user', 'user.profile'],
        });
        if (!post)
            throw new common_1.NotFoundException(`Post #${id} not found`);
        return this.toFeedItem(post, currentUserId);
    }
    async create(userId, dto) {
        const post = this.postRepo.create({ ...dto, userId });
        const saved = await this.postRepo.save(post);
        const full = await this.postRepo.findOne({
            where: { id: saved.id },
            relations: ['user', 'user.profile'],
        });
        return this.toFeedItem(full, userId);
    }
    async update(id, userId, dto) {
        const post = await this.postRepo.findOne({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException();
        if (post.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.postRepo.update(id, dto);
        const updated = await this.postRepo.findOne({
            where: { id },
            relations: ['user', 'user.profile'],
        });
        return this.toFeedItem(updated, userId);
    }
    async remove(id, userId) {
        const post = await this.postRepo.findOne({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException();
        if (post.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.postRepo.delete(id);
    }
    async toggleLike(postId, userId) {
        const existing = await this.likeRepo.findOne({ where: { postId, userId } });
        if (existing) {
            await this.likeRepo.delete(existing.id);
        }
        else {
            await this.likeRepo.save(this.likeRepo.create({ postId, userId }));
            const post = await this.postRepo.findOne({ where: { id: postId } });
            if (post && post.userId !== userId) {
                await this.notificationsService.create(post.userId, 'Someone liked your post', 'Your post received a new like.', 'like', `/`);
            }
        }
        const likeCount = await this.likeRepo.count({ where: { postId } });
        const likedByMe = !existing;
        return { likeCount, likedByMe };
    }
    async repost(postId, userId) {
        const original = await this.postRepo.findOne({ where: { id: postId } });
        if (!original)
            throw new common_1.NotFoundException();
        const repost = this.postRepo.create({
            userId,
            content: original.content,
            imageUrl: original.imageUrl,
            repostOfId: postId,
        });
        const saved = await this.postRepo.save(repost);
        const full = await this.postRepo.findOne({
            where: { id: saved.id },
            relations: ['user', 'user.profile'],
        });
        return this.toFeedItem(full, userId);
    }
    async getComments(postId) {
        const comments = await this.commentRepo.find({
            where: { postId },
            order: { createdAt: 'ASC' },
            relations: ['user', 'user.profile'],
        });
        return comments.map((c) => ({
            id: c.id,
            postId: c.postId,
            userId: c.userId,
            content: c.content,
            createdAt: c.createdAt,
            authorName: c.user?.fullName ?? 'Unknown',
            authorImageUrl: c.user?.profile?.avatarUrl ?? null,
        }));
    }
    async addComment(postId, userId, dto) {
        const comment = this.commentRepo.create({ postId, userId, content: dto.content });
        const saved = await this.commentRepo.save(comment);
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (post && post.userId !== userId) {
            await this.notificationsService.create(post.userId, 'New comment on your post', 'Someone commented on your post.', 'comment', `/`);
        }
        const full = await this.commentRepo.findOne({
            where: { id: saved.id },
            relations: ['user', 'user.profile'],
        });
        return {
            id: full.id,
            postId: full.postId,
            userId: full.userId,
            content: full.content,
            createdAt: full.createdAt,
            authorName: full.user?.fullName ?? 'Unknown',
            authorImageUrl: full.user?.profile?.avatarUrl ?? null,
        };
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException();
        if (comment.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.commentRepo.delete(commentId);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map