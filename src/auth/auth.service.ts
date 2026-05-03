import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

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
  private refreshTokens: RefreshTokenRecord[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    // Always return success to avoid leaking which emails are registered
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresMin = this.configService.get<number>('PASSWORD_RESET_EXPIRES_MIN', 30);
    const expires = new Date(Date.now() + expiresMin * 60 * 1000);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expires;
    await this.userRepo.save(user);

    await this.emailService.sendPasswordReset(user.email, rawToken, expiresMin);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepo.findOne({
      where: { passwordResetToken: hashedToken },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepo.save(user);

    // Revoke all active refresh tokens for security
    this.refreshTokens = this.refreshTokens.filter((r) => r.userId !== user.id);
  }

  private generateTokens(user: User): TokenPair {
    const payload = { sub: user.id, email: user.email, role: user.role, fullName: user.fullName };
    const token = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    this.refreshTokens.push({ userId: user.id, token: refreshToken, expiresAt });

    return { token, refreshToken };
  }

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
