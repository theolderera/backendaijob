import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, OneToMany,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Post } from '../../posts/entities/post.entity';
import { Connection } from '../../connections/entities/connection.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Message } from '../../messages/entities/message.entity';
import { JobApplication } from '../../job-applications/entities/job-application.entity';
import { Organization } from '../../organizations/entities/organization.entity';

export enum UserRole {
  Candidate = 'Candidate',
  Organization = 'Organization',
  Admin = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: UserRole.Candidate })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'datetime', nullable: true })
  passwordResetExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  banUntil: Date | null;

  @Column({ nullable: true })
  banReason: string;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Connection, (conn) => conn.requester)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (conn) => conn.addressee)
  receivedConnections: Connection[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @OneToMany(() => Message, (m) => m.sender)
  messages: Message[];

  @OneToMany(() => JobApplication, (ja) => ja.user)
  jobApplications: JobApplication[];

  @OneToOne(() => Organization, (org) => org.owner, { nullable: true })
  organization: Organization;
}
