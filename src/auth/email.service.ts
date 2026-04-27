import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  private isSmtpConfigured(): boolean {
    const user = this.config.get<string>('SMTP_USER', '');
    const pass = this.config.get<string>('SMTP_PASS', '');
    return (
      !!user &&
      !!pass &&
      !user.includes('your_email') &&
      !pass.includes('your_app_password')
    );
  }

  async sendPasswordReset(
    to: string,
    token: string,
    expiresMin: number,
  ): Promise<void> {
    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
    const from = this.config.get<string>(
      'SMTP_FROM',
      'AI-JOB <no-reply@aijob.com>',
    );

    this.logger.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);

    if (!this.isSmtpConfigured()) {
      this.logger.warn(
        'SMTP not configured — email not sent. Copy the link above to test.',
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Барқарорсозии рамз — AI-JOB',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#2563eb">Барқарорсозии рамз</h2>
            <p>Барои иваз кардани рамзи худ тугмаи зеринро клик кунед:</p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;
                      text-decoration:none;border-radius:6px;font-size:15px">
              Барқарор кардани рамз
            </a>
            <p style="margin-top:16px;color:#6b7280;font-size:13px">
              Ин линк танҳо <strong>${expiresMin} дақиқа</strong> эътибор дорад.<br>
              Агар шумо дархост накарда бошед, ин паёмро нодида гиред.
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
            <p style="color:#9ca3af;font-size:12px">AI-JOB Platform</p>
          </div>
        `,
      });
      this.logger.log(`Reset email sent to ${to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${to}: ${(err as Error).message}`,
      );
      throw err;
    }
  }
}
