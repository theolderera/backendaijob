"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    config;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(config) {
        this.config = config;
        this.transporter = nodemailer.createTransport({
            host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
            port: this.config.get('SMTP_PORT', 587),
            secure: this.config.get('SMTP_SECURE', 'false') === 'true',
            auth: {
                user: this.config.get('SMTP_USER'),
                pass: this.config.get('SMTP_PASS'),
            },
        });
    }
    isSmtpConfigured() {
        const user = this.config.get('SMTP_USER', '');
        const pass = this.config.get('SMTP_PASS', '');
        return (!!user &&
            !!pass &&
            !user.includes('your_email') &&
            !pass.includes('your_app_password'));
    }
    async sendPasswordReset(to, token, expiresMin) {
        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
        const from = this.config.get('SMTP_FROM', 'AI-JOB <no-reply@aijob.com>');
        this.logger.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
        if (!this.isSmtpConfigured()) {
            this.logger.warn('SMTP not configured — email not sent. Copy the link above to test.');
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
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}: ${err.message}`);
            throw err;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map