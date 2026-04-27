import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Language } from './language.entity';

@Entity('profile_languages')
export class ProfileLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileId: number;

  @Column()
  languageId: number;

  @Column({ default: 'Intermediate' })
  level: string;

  @ManyToOne(() => Profile, (p) => p.profileLanguages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne(() => Language, (l) => l.profileLanguages, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}
