import { AppDataSource } from '../../config/database.config';
import log from '../../utils/logger';
import User from './user.model';
import { createUserResponse } from './dtos/user.dtos';
import { UserCreateType } from './validations/user.validation';
import { UserRole } from '../../types/enums';

export const userRepository = AppDataSource.getRepository(User);

namespace userService {
  export const findByEmailId = async (email: string) => {
    log.info(`Find User By email: ${email}`);

    const user = await userRepository.findOne({
      where: { email: email },
    });

    return user;
  };

  export const findById = async (id: string) => {
    log.info(`Find User By ID: ${id}`);

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };

  export const findUserByExternalId = async (authExternalId: string) => {
    log.info(`Find User By External Id: ${authExternalId}`);

    const user = await userRepository.findOne({
      where: { authExternalId },
    });
    if (!user) {
      throw new Error('No users found');
    }

    return user;
  };

  export const getAllUser = async (page: number = 1, limit: number = 10) => {
    log.info('Getting all users');

    // Get the total count of users with the specified role
    const count = await userRepository.count({
      where: {
        role: UserRole.USER,
      },
    });

    // Check if there are any users
    if (count === 0) {
      throw new Error('No users found');
    }

    // Fetch the paginated list of users first, limiting results at the user level
    const subQuery = userRepository
      .createQueryBuilder('user')
      .select('user.id') // Select only the IDs to paginate
      .where('user.role = :role', { role: UserRole.USER })
      .orderBy('user.createdDate', 'DESC') // Optional: ensure consistent ordering
      .skip((page - 1) * limit)
      .take(limit);

    // Get users with all relevant fields
    const users = await userRepository
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.createdDate AS "createdDate"',
        'user.firstName AS "firstName"',
        'user.lastName AS "lastName"',
        'user.email AS email',
        'user.mobileNumber AS "mobileNumber"',
        'user.jobTitle AS "jobTitle"',
        'user.companyName AS "companyName"',
        'user.registrationNumber AS "registrationNumber"',
        'user.dateOfIncorporation AS "dateOfIncorporation"',
        'user.registeredAddress AS "registeredAddress"',
        'user.countryOfRegistration AS "countryOfRegistration"',
        'user.licenseIssuingAuthority AS "licenseIssuingAuthority"',
        'user.purposeOfRequestingData AS "purposeOfRequestingData"',
        'user.status AS "userStatus"',
        'user.emailVerified AS "emailVerified"',
        'user.picture AS picture',
        'user.clientIp AS "clientIp"',
        'user.cardNumber AS "cardNumber"',
        'userSubscription.status AS "subscriptionStatus"',
      ])
      .leftJoin(
        'user_subscriptions',
        'userSubscription',
        'userSubscription.user_id = user.id',
      )
      .where(`user.id IN (${subQuery.getQuery()})`) // Use the paginated user IDs
      .setParameters(subQuery.getParameters()) // Pass parameters for the subquery
      .orderBy('user.createdDate', 'DESC') // Ensure consistent ordering
      .getRawMany();

    // Calculate pagination details
    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;

    return {
      result: users,
      totalPages,
      count,
      hasMore,
    };
  };

  export const createUser = async (requestBody: UserCreateType) => {
    log.info('Creating a new user');

    const response = await userRepository.save(requestBody);

    return createUserResponse(response);
  };

  export const saveUser = async (userData: UserCreateType) => {
    const existingUser = await findByEmailId(userData?.email);

    if (existingUser) {
      log.info('User already exits, update the User');
      existingUser.firstName = userData?.firstName;
      existingUser.lastName = userData?.lastName;
      existingUser.authExternalId = userData?.authExternalId;
      existingUser.emailVerified = userData?.emailVerified;

      const updatedAdmin = await userRepository.save(existingUser);

      return createUserResponse(updatedAdmin);
    }

    log.info('Creating new User');

    const savedUser = await userRepository.save(userData);

    return createUserResponse(savedUser);
  };
}

export default userService;
