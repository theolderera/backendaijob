import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Job } from '../jobs/entities/job.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { KNOWLEDGE_BASE, KnowledgeItem } from './knowledge-base';


@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserSkill) private readonly userSkillRepo: Repository<UserSkill>,
    @InjectRepository(Experience) private readonly expRepo: Repository<Experience>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private detectLanguage(text: string): 'tj' | 'ru' | 'en' {
    const t = text.toLowerCase();
    if (/[ӣӯҳқҷғ]/.test(t) || /\b(чист|чӣ|кист|куҷо|кай|чаро|чихел|салом|ташаккур|хуб|бале|не|ман|ту|мо)\b/i.test(t)) {
      return 'tj';
    }
    if (/\b(как|что|где|это|привет|нужно|помощь|можно|когда|кто|почему|создать|найти|работа|профиль|резюме|навыки|вакансия|компания|сеть|сообщение|настройки|пароль|аватар|подключиться|заявка)\b/i.test(t)) {
      return 'ru';
    }
    return 'en';
  }

  private findBestMatch(question: string): KnowledgeItem | null {
    const q = question.toLowerCase();
    let bestMatch: KnowledgeItem | null = null;
    let maxScore = 0;

    for (const item of KNOWLEDGE_BASE) {
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

  async ask(question: string, userId: number): Promise<{ answer: string }> {
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

  async analyzeCv(dto: { userId?: number; cvText?: string }): Promise<{ skills: string[]; summary: string }> {
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

  async skillGap(userId: number, jobId: number): Promise<{ missingSkills: string[]; matchingSkills: string[] }> {
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

  async improveJob(dto: { title?: string; description?: string; location?: string }): Promise<{ improvedDescription: string }> {
    const desc = dto.description || '';
    const improved = `🚀 **${dto.title || 'Job Opening'}**\n📍 ${dto.location || 'Remote'}\n\n**About the role:**\n${desc}\n\n**What we are looking for:**\n• Strong attention to detail and professional attitude\n• Excellent communication and teamwork skills\n• Proven track record in relevant field\n\n**Benefits:**\n• Competitive salary\n• Flexible working hours\n• Professional growth opportunities\n\n*Join our professional team at AI-JOB!*`;
    return { improvedDescription: improved };
  }

  async draftCoverLetter(dto: { userId: number; jobId: number; tone?: string; extraContext?: string }): Promise<{ coverLetter: string }> {
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

  async draftMessage(dto: { userId: number; recipientName?: string; purpose?: string; tone?: string }): Promise<{ message: string }> {
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
}
