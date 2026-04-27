import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { ProfileLanguage } from './entities/profile-language.entity';
export declare class LanguagesService {
    private readonly langRepo;
    private readonly plRepo;
    constructor(langRepo: Repository<Language>, plRepo: Repository<ProfileLanguage>);
    findAll(): Promise<Language[]>;
    findByProfile(profileId: number): Promise<ProfileLanguage[]>;
    add(profileId: number, languageId: number, level: string): Promise<ProfileLanguage>;
    update(id: number, level: string): Promise<ProfileLanguage>;
    remove(id: number): Promise<void>;
    ensureLanguage(code: string, name: string): Promise<Language>;
}
