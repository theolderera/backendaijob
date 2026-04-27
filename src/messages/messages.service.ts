import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
  ) {}

  async findByConversation(conversationId: number) {
    const msgs = await this.repo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
    // Mark all as read
    await this.repo.update({ conversationId, isRead: false }, { isRead: true });
    return msgs;
  }

  async send(conversationId: number, senderId: number, content: string) {
    const msg = this.repo.create({ conversationId, senderId, content });
    return this.repo.save(msg);
  }

  async remove(id: number, userId: number) {
    const msg = await this.repo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException();
    if (msg.senderId !== userId) throw new ForbiddenException();
    await this.repo.delete(id);
  }
}
