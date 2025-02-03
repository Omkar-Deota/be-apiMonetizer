import { UserRole } from './user.role';

export interface IUserResponse {
	id: string;
	role?: UserRole;
	firstName?: string;
	picture?: string;
	lastName?: string;
	emailVerified?: boolean;
	email: string;
	authExternalId: string;
	createdDate: Date;
	updatedDate: Date;
}
