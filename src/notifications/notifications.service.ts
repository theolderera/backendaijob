import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
  ) {}

  findByUser(userId: number) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findPaged(userId: number, page: number, pageSize: number) {
    const [items, totalCount] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      totalCount,
    };
  }

  async create(userId: number, title: string, message: string, type: string, link?: string) {
    const notif = this.repo.create({ userId, title, message, type, link });
    return this.repo.save(notif);
  }

  async markRead(id: number) {
    await this.repo.update(id, { isRead: true });
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new NotFoundException();
    return n;
  }

  async markAllRead(userId: number) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
