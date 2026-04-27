import { LanguagesService } from './languages.service';
export declare class LanguagesController {
    private readonly service;
    constructor(service: LanguagesService);
    findAll(): Promise<import("./entities/language.entity").Language[]>;
    findByProfile(profileId: number): Promise<import("./entities/profile-language.entity").ProfileLanguage[]>;
    add(dto: {
        profileId: number;
        languageId: number;
        level: string;
    }): Promise<import("./entities/profile-language.entity").ProfileLanguage>;
    update(id: number, dto: {
        level: string;
    }): Promise<import("./entities/profile-language.entity").ProfileLanguage>;
    remove(id: number): Promise<void>;
}
