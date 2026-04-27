import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { ProfileLanguage } from './entities/profile-language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language) private readonly langRepo: Repository<Language>,
    @InjectRepository(ProfileLanguage) private readonly plRepo: Repository<ProfileLanguage>,
  ) {}

  findAll() {
    return this.langRepo.find({ order: { name: 'ASC' } });
  }

  findByProfile(profileId: number) {
    return this.plRepo.find({ where: { profileId }, relations: ['language'] });
  }

  async add(profileId: number, languageId: number, level: string) {
    const lang = await this.langRepo.findOne({ where: { id: languageId } });
    if (!lang) throw new NotFoundException(`Language #${languageId} not found`);
    return this.plRepo.save(this.plRepo.create({ profileId, languageId, level }));
  }

  async update(id: number, level: string) {
    await this.plRepo.update(id, { level });
    const pl = await this.plRepo.findOne({ where: { id } });
    if (!pl) throw new NotFoundException();
    return pl;
  }

  async remove(id: number) {
    await this.plRepo.delete(id);
  }

  async ensureLanguage(code: string, name: string): Promise<Language> {
    let lang = await this.langRepo.findOne({ where: { code } });
    if (!lang) lang = await this.langRepo.save(this.langRepo.create({ code, name }));
    return lang;
  }
}
