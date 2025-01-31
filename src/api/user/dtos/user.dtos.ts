import { IUserResponse } from '../../../types/user.type';
import User from '../user.model';

export const createUserResponse = (
  users: User | undefined,
): IUserResponse | object => {
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
    updatedDate: users.updatedDate,
  };
};
