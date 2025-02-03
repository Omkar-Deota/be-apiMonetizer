import { AppDataSource } from '../../config/database.config';
import log from '../../utils/logger';
import User from './user.model';
import { createUserResponse } from './user.dtos';
import { UserCreateType } from './user.validation';
import { UserRole, UserStatus } from './user.role';
import { ActivityLogService } from '../activityLogs/activityLogs.service';
import { ActivityLogType } from '../../types/enums';
// import emailService from '../../services/email.service';
import { USER_FIELDS, PAYMENT_FIELDS } from './constants/query-fields';
import { transformRawData } from './utils/transform';
import {
  RawUserPaymentData,
  PaginatedUserPaymentResponse,
} from './types/user-payment.types';
import { isNumber } from '../../utils/validators';

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

  export const saveExistingUser = async (existingUser: User) => {
    log.info('Saving existing user');
    const userExists = await findByEmailId(existingUser?.email);

    if (!userExists) {
      throw new Error('User not found');
    }

    await userRepository.save(existingUser);
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

    await ActivityLogService.logActivity(
      savedUser.id,
      ActivityLogType.USER_SIGNUP,
      {
        description: savedUser.email + ' completed signup',
      },
    );

    return createUserResponse(savedUser);
  };

  export const updateUserDetails = async (
    userId: string,
    updateData: Partial<User>,
  ) => {
    log.info(`Updating user with ID: ${userId}`);

    const user = await findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Only update specific user details fields
    const allowedFields = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      mobileNumber: updateData.mobileNumber,
      companyName: updateData.companyName,
    };

    // Filter out undefined values
    const filteredUpdate = Object.fromEntries(
      Object.entries(allowedFields).filter(([, value]) => value !== undefined),
    );

    // Update only the allowed fields
    Object.assign(user, filteredUpdate);

    if (user.status === UserStatus.LOGGED_IN) {
      user.status = UserStatus.ONBOARDING;
    }

    console.log('user', user);
    const updatedUser = await userRepository.save(user);
    console.log('updatedUser', updatedUser);

    return updatedUser;
  };

  export const updateUserKycDetails = async (
    userId: string,
    updateData: Partial<User>,
  ) => {
    const user = await findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Only allow specific KYC fields to be updated
    const allowedFields = {
      companyName: updateData.companyName,
      registrationNumber: updateData.registrationNumber,
      dateOfIncorporation: updateData.dateOfIncorporation,
      registeredAddress: updateData.registeredAddress,
      countryOfRegistration: updateData.countryOfRegistration,
      licenseIssuingAuthority: updateData.licenseIssuingAuthority,
      purposeOfRequestingData: updateData.purposeOfRequestingData,
    };

    // Filter out undefined values
    const filteredUpdate = Object.fromEntries(
      Object.entries(allowedFields).filter(([, value]) => value !== undefined),
    );

    // Update only the allowed fields
    Object.assign(user, filteredUpdate);

    if (user.status === UserStatus.ONBOARDING) {
      user.status = UserStatus.PENDING_APPROVAL;
    }

    return await userRepository.save(user);
  };

  export const updateUser = async (
    userId: string,
    updateData: Partial<User>,
  ) => {
    log.info(`Updating user with ID: ${userId}`);

    const user = await findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update only the provided fields
    Object.assign(user, updateData);

    const updatedUser = await userRepository.save(user);

    return updatedUser;
  };

  // export const toggleUserStatus = async (userId: string, approve: boolean): Promise<User> => {
  // 	const user = await findById(userId);
  // 	if (!user) {
  // 		throw new Error('User not found');
  // 	}

  // 	user.status = approve ? UserStatus.ADMIN_APPROVED : UserStatus.ADMIN_REJECTED;
  // 	const updatedUser = await userRepository.save(user);

  // 	// Send email notification based on status
  // 	try {
  // 		if (approve) {
  // 			await emailService.sendAdminApprovalEmail(user.email, user.firstName || '');
  // 		} else {
  // 			await emailService.sendAdminRejectionEmail(user.email, user.firstName || '');
  // 		}
  // 	} catch (error) {
  // 		log.error('Error sending status change email:', error);
  // 		// Don't throw error here to prevent transaction rollback
  // 		// Email sending failure shouldn't affect status update
  // 	}

  // 	return updatedUser;
  // };

  export const getUsersWithPayments = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUserPaymentResponse> => {
    try {
      // Validate input parameters
      if (!isNumber(page) || page < 1) {
        throw new Error('Invalid page number');
      }
      if (!isNumber(limit) || limit < 1) {
        throw new Error('Invalid limit');
      }

      log.info('Fetching users with payments from database');
      const skip = (page - 1) * limit;

      const query = userRepository
        .createQueryBuilder('user')
        .select([...USER_FIELDS, ...PAYMENT_FIELDS])
        .leftJoin('payments', 'payment', 'payment.userId = user.id')
        .where('user.status = :status AND user.role = :role', {
          status: UserStatus.PENDING_PAYMENT_APPROVAL,
          role: UserRole.USER,
        })
        .orderBy('user.createdDate', 'DESC')
        .skip(skip)
        .take(limit);

      const [rawResults, count] = await Promise.all([
        query.getRawMany<RawUserPaymentData>(),
        query.getCount(),
      ]);

      const users = rawResults.map(transformRawData);
      const totalPages = Math.ceil(count / limit);
      const hasMore = page < totalPages;

      const result = {
        data: users,
        count,
        totalPages,
        hasMore,
        size: users.length,
      };

      return result;
    } catch (error) {
      log.error('Error in getUsersWithPayments:', error);
      throw new Error(`Failed to get users with payments: ${error}`);
    }
  };

  export const approveUserPayment = async (userId: string) => {
    log.info(`Approving payment for user: ${userId}`);

    const user = await findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== UserStatus.PENDING_PAYMENT_APPROVAL) {
      throw new Error('User is not in pending payment approval status');
    }

    user.status = UserStatus.ACTIVE;
    await userRepository.save(user);

    // Send email notification to user about payment approval
    // await emailService.sendPaymentApprovalEmail(user.email);

    return user;
  };
}

export default userService;
