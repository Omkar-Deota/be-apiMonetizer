import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../utils/entity';
import User from '../user/user.model';
import { ActivityLogType } from '../../types/enums';

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @Column({ nullable: false })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'enum',
    enum: ActivityLogType,
    nullable: false
  })
  activityType!: ActivityLogType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: false })
  activityDate!: Date;
}
