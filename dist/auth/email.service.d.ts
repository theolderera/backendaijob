import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private isSmtpConfigured;
    sendPasswordReset(to: string, token: string, expiresMin: number): Promise<void>;
}
