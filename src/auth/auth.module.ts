import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default_jwt_secret_key_123',
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
