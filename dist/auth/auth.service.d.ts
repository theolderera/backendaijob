import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface TokenPair {
    token: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly configService;
    private refreshTokens;
    constructor(userRepo: Repository<User>, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<TokenPair>;
    login(dto: LoginDto): Promise<TokenPair>;
    refresh(refreshToken: string): Promise<TokenPair>;
    logout(refreshToken: string): Promise<void>;
    private generateTokens;
    registerSeed(dto: RegisterDto): Promise<User>;
}
