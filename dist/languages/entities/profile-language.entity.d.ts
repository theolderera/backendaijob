import { Profile } from '../../profiles/entities/profile.entity';
import { Language } from './language.entity';
export declare class ProfileLanguage {
    id: number;
    profileId: number;
    languageId: number;
    level: string;
    profile: Profile;
    language: Language;
}
