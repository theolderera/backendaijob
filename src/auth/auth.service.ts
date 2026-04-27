import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface TokenPair {
  token: string;
  refreshToken: string;
}

interface RefreshTokenRecord {
  userId: number;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory refresh token store (sufficient for SQLite dev mode)
  private refreshTokens: RefreshTokenRecord[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash,
      role: dto.role ?? UserRole.Candidate,
    });
    await this.userRepo.save(user);
    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const record = this.refreshTokens.find(
      (r) => r.token === refreshToken && r.expiresAt > new Date(),
    );
    if (!record) throw new UnauthorizedException('Invalid or expired refresh token');

    this.refreshTokens = this.refreshTokens.filter((r) => r.token !== refreshToken);

    const user = await this.userRepo.findOne({ where: { id: record.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter((r) => r.token !== refreshToken);
  }

  private generateTokens(user: User): TokenPair {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    this.refreshTokens.push({ userId: user.id, token: refreshToken, expiresAt });

    return { token, refreshToken };
  }

  // Called by seed script to register users without throwing on duplicates
  async registerSeed(dto: RegisterDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) return existing;
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash,
      role: dto.role ?? UserRole.Candidate,
    });
    return this.userRepo.save(user);
  }
}
