import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation) private readonly repo: Repository<Conversation>,
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
  ) {}

  private async enrichConversation(conv: Conversation, userId: number) {
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

  async findByUser(userId: number) {
    const convs = await this.repo.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['user1', 'user2'],
      order: { createdAt: 'DESC' },
    });
    return Promise.all(convs.map((c) => this.enrichConversation(c, userId)));
  }

  async findOrCreate(user1Id: number, otherUserId: number) {
    const user2Id = otherUserId;
    const existing = await this.repo.findOne({
      where: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
      relations: ['user1', 'user2'],
    });
    if (existing) return this.enrichConversation(existing, user1Id);

    const conv = await this.repo.save(this.repo.create({ user1Id, user2Id }));
    const full = await this.repo.findOne({
      where: { id: conv.id },
      relations: ['user1', 'user2'],
    });
    return this.enrichConversation(full!, user1Id);
  }

  async remove(id: number, userId: number) {
    const conv = await this.repo.findOne({ where: { id } });
    if (!conv) throw new NotFoundException();
    if (conv.user1Id !== userId && conv.user2Id !== userId) throw new ForbiddenException();
    await this.repo.delete(id);
  }
}
