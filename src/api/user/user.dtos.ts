import { PackageType, SubscriptionStatus } from '../../types/enums';
import User from './user.model';
import { UserStatus } from './user.role';
import { IUserResponse } from './user.type';

interface AdminBulkUser {
	id: string;
	createdDate: string;
	userStatus: UserStatus;
	name: string;
	email: string;
	subscriptionPlan: PackageType;
	subscriptionStatus: SubscriptionStatus;
}

export const createUserResponse = (users: User | undefined): IUserResponse | object => {
	if (!users) return {};

	return {
		id: users.id,
		firstName: users.firstName,
		lastName: users.lastName,
		emailVerified: users.emailVerified,
		picture: users.picture,
		email: users.email,
		authExternalId: users.authExternalId,
		createdDate: users.createdDate,
		updatedDate: users.updatedDate
	};
};

export const createBulkUserResponse = (users: AdminBulkUser[]): AdminBulkUser[] => {
	if (!users) return [];

	return users.map(user => {
		return {
			id: user.id,
			name: user.name,
			userStatus: user.userStatus,
			subscriptionStatus: user.subscriptionStatus,
			email: user.email,
			subscriptionPlan: user.subscriptionPlan,
			createdDate: user.createdDate
		};
	});
};
