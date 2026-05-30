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


import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private defaultModel: string = 'gpt-3.5-turbo'; // Default model, can be overridden by env

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserSkill) private readonly userSkillRepo: Repository<UserSkill>,
    @InjectRepository(Experience) private readonly expRepo: Repository<Experience>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    const baseURL = this.configService.get<string>('AI_BASE_URL');
    const model = this.configService.get<string>('AI_MODEL');

    if (model) {
      this.defaultModel = model;
    }

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: baseURL || undefined, // If undefined, defaults to OpenAI's base URL
      });
    }
  }

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
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: this.defaultModel,
          messages: [
            { role: 'system', content: "You are a professional AI assistant for the AI-JOB platform (a LinkedIn clone for Tajikistan). Answer in the user's language (Tajik, Russian, or English). Provide helpful career, profile, or job searching advice. Be concise and professional." },
            { role: 'user', content: question }
          ],
        });
        return { answer: response.choices[0]?.message?.content || '' };
      } catch (error: any) {
        console.error('AI Error (ask):', error?.response?.data || error.message);
        return { answer: `Хатогӣ ҳангоми пайвастшавӣ ба AI (${this.defaultModel}). Лутфан калиди API ё номи моделро тафтиш кунед. Тафсилоти хатогӣ: ${error.message}` };
      }
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

  async analyzeCv(dto: { userId?: number; cvText?: string }): Promise<{ skills: string[]; summary: string }> {
    const text = (dto.cvText || '').toLowerCase();

    if (this.openai && text.length > 10) {
      const response = await this.openai.chat.completions.create({
        model: this.defaultModel,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: "You are an expert HR and recruitment AI. Output ONLY a valid JSON object with exactly two fields: 'skills' (an array of strings representing the key professional skills found) and 'summary' (a brief summary and assessment of the candidate's profile, max 3 sentences, in the same language as the CV)." },
          { role: 'user', content: `Analyze the following CV text:\n\n${text}` }
        ],
      });
      try {
        const result = JSON.parse(response.choices[0]?.message?.content || '{}');
        return {
          skills: Array.isArray(result.skills) ? result.skills : [],
          summary: result.summary || 'Summary generated by AI.',
        };
      } catch (e) {
        // Fallback to manual if parsing fails
      }
    }

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
    
    if (this.openai && jobText) {
       const response = await this.openai.chat.completions.create({
        model: this.defaultModel,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: "You are an expert HR AI. Output ONLY a valid JSON object with two arrays: 'matchingSkills' (skills the user has that the job needs) and 'missingSkills' (important skills the job needs but the user doesn't have)." },
          { role: 'user', content: `Job Description:\n${jobText}\n\nUser Skills:\n${userSkillNames.join(', ')}` }
        ],
      });
      try {
        const result = JSON.parse(response.choices[0]?.message?.content || '{}');
        return {
          matchingSkills: result.matchingSkills || [],
          missingSkills: result.missingSkills || [],
        };
      } catch (e) {}
    }

    const commonSkills = ['react', 'node', 'sql', 'typescript', 'javascript', 'python', 'management', 'design'];
    const requiredSkills = commonSkills.filter(s => jobText.includes(s));
    const matching = requiredSkills.filter(s => userSkillNames.includes(s));
    const missing = requiredSkills.filter(s => !userSkillNames.includes(s));
    return { matchingSkills: matching, missingSkills: missing };
  }

  async improveJob(dto: { title?: string; description?: string; location?: string }): Promise<{ improvedDescription: string }> {
    const desc = dto.description || '';
    
    if (this.openai && desc.length > 5) {
      const response = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: "You are an expert recruiter and copywriter. Return ONLY the improved job description text." },
          { role: 'user', content: `Improve the following job description to make it more professional, appealing, and structured. Use formatting like bullet points.\n\nTitle: ${dto.title || 'N/A'}\nLocation: ${dto.location || 'N/A'}\nDescription:\n${desc}` }
        ],
      });
      return { improvedDescription: response.choices[0]?.message?.content || '' };
    }

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

    if (this.openai) {
       const response = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: "You are an expert career coach AI. Return ONLY the cover letter text." },
          { role: 'user', content: `Write a cover letter for the position of "${jobTitle}".\nCandidate Name: ${userName}\nCandidate Skills: ${skillsList}\nTone: ${dto.tone || 'professional'}\nExtra Context: ${dto.extraContext || 'None'}` }
        ],
      });
      return { coverLetter: response.choices[0]?.message?.content || '' };
    }

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

    if (this.openai) {
       const response = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: "You are an expert networking AI. Return ONLY the message text." },
          { role: 'user', content: `Write a networking message to ${recipient}.\nSender Name: ${senderName}\nPurpose: ${dto.purpose || 'networking and collaboration'}\nTone: ${dto.tone || 'professional'}` }
        ],
      });
      return { message: response.choices[0]?.message?.content || '' };
    }

    const message = `Hello ${recipient},

My name is ${senderName}. I am reaching out to you via AI-JOB regarding ${dto.purpose || 'potential collaboration'}. 

I have been following your work and would love to connect and discuss how we might work together or share insights in our industry.

Looking forward to hearing from you!

Best,
${senderName}`;
    return { message: message };
  }
}
