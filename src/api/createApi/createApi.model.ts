import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utils/entity';
import { ApiKeyStatus } from '../../types/enums';

@Entity('api_keys')
export default class ApiKeys extends BaseEntity {
  @Column({ nullable: false })
  apiKey!: string;

  @Column({ nullable: false })
  apiKeyDescription!: string;

  @Column({ nullable: false })
  subscriptionType!: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  usageCount!: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted!: boolean;

  @Column({ type: 'enum', enum: ApiKeyStatus, default: ApiKeyStatus.ACTIVE })
  status!: ApiKeyStatus;
}
