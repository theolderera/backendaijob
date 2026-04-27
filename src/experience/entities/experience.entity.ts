import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: 'varchar' })
  startDate: string;

  @Column({ nullable: true, type: 'varchar' })
  endDate: string;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ nullable: true, type: 'text' })
  description: string;
}
