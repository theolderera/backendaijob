"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_skill_entity_1 = require("../skills/entities/user-skill.entity");
const experience_entity_1 = require("../experience/entities/experience.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const profile_entity_1 = require("../profiles/entities/profile.entity");
const user_entity_1 = require("../users/entities/user.entity");
const knowledge_base_1 = require("./knowledge-base");
const profanity_list_1 = require("./profanity-list");
let AiService = class AiService {
    configService;
    userSkillRepo;
    expRepo;
    jobRepo;
    profileRepo;
    userRepo;
    constructor(configService, userSkillRepo, expRepo, jobRepo, profileRepo, userRepo) {
        this.configService = configService;
        this.userSkillRepo = userSkillRepo;
        this.expRepo = expRepo;
        this.jobRepo = jobRepo;
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }
    detectLanguage(text) {
        const t = text.toLowerCase();
        if (/[ӣӯҳқҷғ]/.test(t) || /\b(чист|чӣ|кист|куҷо|кай|чаро|чихел|салом|ташаккур|хуб|бале|не|ман|ту|мо)\b/i.test(t)) {
            return 'tj';
        }
        if (/\b(как|что|где|это|привет|нужно|помощь|можно|когда|кто|почему|создать|найти|работа|профиль|резюме|навыки|вакансия|компания|сеть|сообщение|настройки|пароль|аватар|подключиться|заявка)\b/i.test(t)) {
            return 'ru';
        }
        return 'en';
    }
    findBestMatch(question) {
        const q = question.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;
        for (const item of knowledge_base_1.KNOWLEDGE_BASE) {
            let score = 0;
            for (const keyword of item.keywords) {
                if (q.includes(keyword.toLowerCase())) {
                    score += 1;
                }
                const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
                if (regex.test(q)) {
                    score += 2;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        }
        return maxScore >= 1 ? bestMatch : null;
    }
    async ask(question, userId) {
        if ((0, profanity_list_1.hasProfanity)(question)) {
            const banDuration = 30 * 60 * 1000;
            const banUntil = new Date(Date.now() + banDuration);
            await this.userRepo.update(userId, {
                banUntil: banUntil,
                banReason: 'Истифодаи калимаҳои ноҷоиз / Использование нецензурной лексики / Profanity usage',
            });
            throw new common_1.ForbiddenException({
                message: 'PROFANE_CONTENT_DETECTED',
                error: 'Шумо барои 30 дақиқа аз система хориҷ карда шудед. / Вы были заблокированы на 30 минут. / You have been banned for 30 minutes.',
            });
        }
        const lang = this.detectLanguage(question);
        const match = this.findBestMatch(question);
        if (match) {
            return { answer: match.responses[lang] };
        }
        const fallbacks = {
            tj: 'Бубахшед, ман саволи шуморо дақиқ нафаҳмидам. Ман метавонам дар бораи истифодаи профил, ҷустуҷӯи кор, сохтани ширкат ва дигар имкониятҳои AI-JOB маълумот диҳам. Лутфан саволро дақиқтар нависед.',
            ru: 'Извините, я не совсем понял ваш вопрос. Я могу рассказать о том, как настроить профиль, найти работу, создать компанию или использовать другие функции AI-JOB. Пожалуйста, уточните ваш вопрос.',
            en: "I'm sorry, I didn't quite understand your question. I can provide information about setting up your profile, finding jobs, creating a company, and other AI-JOB features. Could you please rephrase or be more specific?",
        };
        return { answer: fallbacks[lang] };
    }
    async analyzeCv(dto) {
        const text = (dto.cvText || '').toLowerCase();
        const lang = this.detectLanguage(text);
        const commonSkills = [
            'typescript', 'react', 'next.js', 'nodejs', 'nest', 'python', 'django',
            'spring', 'sql', 'postgresql', 'mongodb', 'docker', 'git', 'figma', 'ui/ux',
            'agile', 'english', 'russian', 'tajik'
        ];
        const extractedSkills = commonSkills.filter(skill => text.includes(skill));
        const summaries = {
            tj: `Ман матни CV-и шуморо таҳлил кардам. Нуқтаҳои асосӣ:\n\n• Маҳоратҳои ёфтшуда: ${extractedSkills.join(', ') || 'Муайян нашуд'}\n• Маслиҳат: Кӯшиш кунед, ки таҷрибаи кории худро бо рақамҳо ва натиҷаҳои мушаххас пурра кунед.\n• Баҳодиҳӣ: Профили шумо барои соҳаи IT мувофиқ аст.`,
            ru: `Я проанализировал ваш текст CV. Ключевые моменты:\n\n• Найденные навыки: ${extractedSkills.join(', ') || 'Не определены'}\n• Совет: Попробуйте дополнить описание опыта работы конкретными цифрами и результатами.\n• Оценка: Ваш профиль хорошо подходит для сферы IT/Технологий.`,
            en: `I have analyzed your CV text. Key findings:\n\n• Extracted Skills: ${extractedSkills.join(', ') || 'None identified'}\n• Tip: Try to supplement your work experience description with specific numbers and achievements.\n• Assessment: Your profile shows good potential for the IT/Tech sector.`,
        };
        return { skills: extractedSkills, summary: summaries[lang] };
    }
    async skillGap(userId, jobId) {
        const userSkills = await this.userSkillRepo.find({ where: { userId }, relations: ['skill'] });
        const job = await this.jobRepo.findOne({ where: { id: jobId } });
        const userSkillNames = userSkills.map((us) => (us.skill?.name ?? '').toLowerCase());
        const jobText = job ? `${job.title} ${job.description}`.toLowerCase() : '';
        const commonSkills = ['react', 'node', 'sql', 'typescript', 'javascript', 'python', 'management', 'design'];
        const requiredSkills = commonSkills.filter(s => jobText.includes(s));
        const matching = requiredSkills.filter(s => userSkillNames.includes(s));
        const missing = requiredSkills.filter(s => !userSkillNames.includes(s));
        return { matchingSkills: matching, missingSkills: missing };
    }
    async improveJob(dto) {
        const desc = dto.description || '';
        const improved = `🚀 **${dto.title || 'Job Opening'}**\n📍 ${dto.location || 'Remote'}\n\n**About the role:**\n${desc}\n\n**What we are looking for:**\n• Strong attention to detail and professional attitude\n• Excellent communication and teamwork skills\n• Proven track record in relevant field\n\n**Benefits:**\n• Competitive salary\n• Flexible working hours\n• Professional growth opportunities\n\n*Join our professional team at AI-JOB!*`;
        return { improvedDescription: improved };
    }
    async draftCoverLetter(dto) {
        const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
        const profile = await this.profileRepo.findOne({ where: { userId: dto.userId }, relations: ['user'] });
        const userSkills = await this.userSkillRepo.find({ where: { userId: dto.userId }, relations: ['skill'] });
        const skillsList = userSkills.map((us) => us.skill?.name).join(', ');
        const jobTitle = job?.title ?? 'the position';
        const userName = profile?.user?.fullName || 'Professional Candidate';
        const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the **${jobTitle}** position at your company, as advertised on AI-JOB. 

With a background in this field and my core skills in **${skillsList || 'various professional areas'}**, I am confident that I can bring significant value to your team. My experience has taught me how to handle complex challenges and deliver high-quality results.

${dto.extraContext ? `Regarding your requirements: ${dto.extraContext}\n` : ''}
I would welcome the opportunity to discuss how my skills and experience can contribute to your company's success. Thank you for your time and consideration.

Best regards,
${userName}`;
        return { coverLetter: letter };
    }
    async draftMessage(dto) {
        const profile = await this.profileRepo.findOne({ where: { userId: dto.userId }, relations: ['user'] });
        const senderName = profile?.user?.fullName || 'User';
        const recipient = dto.recipientName || 'Hiring Manager';
        const message = `Hello ${recipient},

My name is ${senderName}. I am reaching out to you via AI-JOB regarding ${dto.purpose || 'potential collaboration'}. 

I have been following your work and would love to connect and discuss how we might work together or share insights in our industry.

Looking forward to hearing from you!

Best,
${senderName}`;
        return { message: message };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_skill_entity_1.UserSkill)),
    __param(2, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(3, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(4, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AiService);
//# sourceMappingURL=ai.service.js.map