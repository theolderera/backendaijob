import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProfileLanguage } from '../../languages/entities/profile-language.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, default: false })
  openToWork: boolean;

  @Column({ default: 0 })
  viewersCount: number;

  @Column({ nullable: true })
  cvUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProfileLanguage, (pl) => pl.profile)
  profileLanguages: ProfileLanguage[];
}
