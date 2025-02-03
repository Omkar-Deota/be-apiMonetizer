import { UserRole } from '../user/user.role';

export interface RequestContext {
	email: string;
	userId: string;
	role: UserRole | undefined;
	authExternalId: string;
	emailVerified: boolean;
}
