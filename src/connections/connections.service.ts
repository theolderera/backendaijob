import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or } from 'typeorm';
import { Connection, ConnectionStatus } from './entities/connection.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection) private readonly repo: Repository<Connection>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private formatConn(conn: Connection, currentUserId: number) {
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
            imageUrl: (other as any).profile?.avatarUrl ?? null,
            headline: (other as any).profile?.headline ?? null,
          }
        : null,
    };
  }

  async findMy(userId: number) {
    const conns = await this.repo.find({
      where: [
        { requesterId: userId, status: ConnectionStatus.Accepted },
        { addresseeId: userId, status: ConnectionStatus.Accepted },
      ],
      relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
    });
    return conns.map((c) => this.formatConn(c, userId));
  }

  async findPending(userId: number) {
    const conns = await this.repo.find({
      where: { addresseeId: userId, status: ConnectionStatus.Pending },
      relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
    });
    return conns.map((c) => this.formatConn(c, userId));
  }

  async findAll(userId: number) {
    const conns = await this.repo.find({
      where: [{ requesterId: userId }, { addresseeId: userId }],
      relations: ['requester', 'requester.profile', 'addressee', 'addressee.profile'],
    });
    return conns.map((c) => this.formatConn(c, userId));
  }

  async send(requesterId: number, addresseeId: number) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot connect with yourself');
    }
    const existing = await this.repo.findOne({
      where: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    });
    if (existing) throw new ConflictException('Connection already exists');

    const conn = this.repo.create({ requesterId, addresseeId, status: ConnectionStatus.Pending });
    const saved = await this.repo.save(conn);

    await this.notificationsService.create(
      addresseeId,
      'New connection request',
      'You have a new connection request.',
      'connection',
      `/network`,
    );

    return saved;
  }

  async respond(id: number, userId: number, accept: boolean) {
    const conn = await this.repo.findOne({ where: { id } });
    if (!conn) throw new NotFoundException();
    conn.status = accept ? ConnectionStatus.Accepted : ConnectionStatus.Rejected;
    const saved = await this.repo.save(conn);

    if (accept) {
      await this.notificationsService.create(
        conn.requesterId,
        'Connection accepted',
        'Your connection request was accepted.',
        'connection',
        `/profile/${userId}`,
      );
    }

    return saved;
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
