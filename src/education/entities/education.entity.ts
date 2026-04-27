import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_educations')
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column({ nullable: true })
  field: string;

  @Column({ nullable: true, type: 'varchar' })
  startDate: string;

  @Column({ nullable: true, type: 'varchar' })
  endDate: string;

  @Column({ nullable: true, type: 'text' })
  description: string;
}
