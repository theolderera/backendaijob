import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn, Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ConnectionStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

@Entity('connections')
@Unique(['requesterId', 'addresseeId'])
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requesterId: number;

  @Column()
  addresseeId: number;

  @Column({ type: 'varchar', default: ConnectionStatus.Pending })
  status: ConnectionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sentConnections, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedConnections, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'addresseeId' })
  addressee: User;
}
