import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../utils/entity';
import User from '../user/user.model';

@Entity('api_call_logs')
export default class ApiCallLog extends BaseEntity {
  @Column({ nullable: false })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'jsonb', nullable: true })
  requestParams?: Record<string, any>;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
