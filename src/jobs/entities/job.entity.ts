import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  employmentType: string;

  @Column({ nullable: true })
  experienceLevel: string;

  @Column({ nullable: true })
  salary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (org) => org.jobs, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => JobApplication, (ja) => ja.job)
  applications: JobApplication[];
}
