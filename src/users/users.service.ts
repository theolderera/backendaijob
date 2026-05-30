import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(search?: string): Promise<User[]> {
    if (!search) {
      return this.userRepo.find();
    }
    return this.userRepo.createQueryBuilder('user')
      .where('user.fullName ILIKE :search', { search: `%${search}%` })
      .orWhere('user.email ILIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, dto: { fullName?: string; phoneNumber?: string }): Promise<User> {
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  sanitize(user: User) {
    const { passwordHash, ...safe } = user as User & { passwordHash: string };
    return safe;
  }
}
