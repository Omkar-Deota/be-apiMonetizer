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

	@Column({ nullable: true })
	jobTitle?: string;

	@Column({ nullable: true, length: 100 })
	companyName?: string;

	@Column({ nullable: true, length: 50 })
	registrationNumber?: string;

	@Column({ nullable: true, type: 'date' })
	dateOfIncorporation?: Date;

	@Column({ nullable: true, length: 200 })
	registeredAddress?: string;

	@Column({ nullable: true, length: 100 })
	countryOfRegistration?: string;

	@Column({ nullable: true, length: 100 })
	licenseIssuingAuthority?: string;

	@Column({ nullable: true, length: 500 })
	purposeOfRequestingData?: string;

	@Column({ nullable: false, unique: true })
	authExternalId!: string;

	@Column({ nullable: true })
	emailVerified?: boolean;

	@Column({ type: 'enum', enum: UserRole, default: UserRole?.USER, nullable: true })
	role?: UserRole;

	@Column({ type: 'enum', enum: UserStatus, default: UserStatus.LOGGED_IN })
	status!: UserStatus;

	@Column({ nullable: true })
	picture?: string;

	@Column({ nullable: true })
	clientIp?: string;

	@Column({ nullable: true })
	cardNumber?: string;

	@Column({ nullable: true })
	token?: string;

}
