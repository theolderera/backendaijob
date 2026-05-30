import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { Connection, ConnectionStatus } from '../connections/entities/connection.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Connection) private readonly connectionRepo: Repository<Connection>,
  ) {}

  async findByUserId(userId: number): Promise<Profile | null> {
    const profile = await this.profileRepo.findOne({
      where: { userId },
      relations: ['user', 'profileLanguages', 'profileLanguages.language'],
    });
    if (profile) {
      await this.profileRepo.increment({ id: profile.id }, 'viewersCount', 1);
    }
    return profile;
  }

  async findById(id: number): Promise<Profile> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`Profile #${id} not found`);
    return profile;
  }

  async create(userId: number, dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.profileRepo.findOne({ where: { userId } });
    if (existing) return this.update(existing.id, dto);

    const profile = this.profileRepo.create({ ...dto, userId });
    return this.profileRepo.save(profile);
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profile> {
    await this.profileRepo.update(id, dto);
    return this.findById(id);
  }

  async upsertByUserId(userId: number, dto: UpdateProfileDto): Promise<Profile> {
    const existing = await this.profileRepo.findOne({ where: { userId } });
    if (existing) {
      await this.profileRepo.update(existing.id, dto);
      return this.findById(existing.id);
    }
    const profile = this.profileRepo.create({ ...dto, userId });
    return this.profileRepo.save(profile);
  }

  async getAnalytics(userId: number) {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    const connectionsCount = await this.connectionRepo.count({
      where: [
        { requesterId: userId, status: ConnectionStatus.Accepted },
        { addresseeId: userId, status: ConnectionStatus.Accepted },
      ]
    });
    return {
      viewersCount: profile?.viewersCount || 0,
      connectionsCount
    };
  }
}
