import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utils/entity';
import { UserRole, UserStatus } from './user.role';

@Entity('user')
export default class User extends BaseEntity {
  @Column({ nullable: true, length: 50 })
  firstName?: string;

  @Column({ nullable: true, length: 50 })
  lastName?: string;

  @Column({ nullable: true })
  mobileNumber?: string;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: true, length: 100 })
  companyName?: string;

  @Column({ nullable: false, unique: true })
  authExternalId!: string;

  @Column({ nullable: true })
  emailVerified?: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole?.USER,
    nullable: true,
  })
  role?: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ nullable: true })
  picture?: string;
}
