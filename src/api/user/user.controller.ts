import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/apiResponses';
import userService from './user.service';
import {
  userCreateSchema,
  UserCreateType,
  userUpdateSchema,
} from './user.validation';
import Auth0Service from '../auth/auth.service';
import log from '../../utils/logger';

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const { page = '', limit = '' } = req.query;
    const pgeInt = page ? parseInt(page as string) : 1;
    const limitInt = limit ? parseInt(limit as string) : 10;
    const result = await userService.getAllUser(pgeInt, limitInt);

    successResponse({
      res,
      data: result.result,
      message: 'Successfully fetched users',
      totalPages: result.totalPages,
      count: result.count,
      hasMore: result.hasMore,
    });
  } catch (error) {
    errorResponse({ req, res, error });
  }
};

export const saveUser = async (req: Request, res: Response) => {
  try {
    const validatedReqBody: UserCreateType = await userCreateSchema.validate(
      req.body,
      { abortEarly: false },
    );

    const result = await userService.saveUser(validatedReqBody);

    successResponse({ res, data: result });
  } catch (error) {
    errorResponse({ req, res, error });
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req?.context?.authExternalId;
    const emailVerified = req?.context?.emailVerified;

    if (!userId) {
      errorResponse({ req, res, error: 'User not found' });
      return;
    }
    if (emailVerified) {
      log.info('User email is already verified.');
      errorResponse({ req, res, error: 'User email is already verified.' });
    }

    await Auth0Service.resendVerificationEmail(userId);

    log.info(`Verification email triggered successfully for user: ${userId}`);
    successResponse({
      res,
      data: { message: 'Verification email sent successfully.' },
    });
  } catch (error) {
    log.error('Error in resendVerificationEmail controller', error);
    errorResponse({
      req,
      res,
      error: 'Failed to send verification email.',
      statusCode: 500,
    });
  }
};

export const getUserByExternalId = async (req: Request, res: Response) => {
  try {
    const { id = '' } = req.query;

    if (!id) throw new Error('Id is required');

    const user = await userService.findUserByExternalId(id as string);

    successResponse({ res, data: user });
  } catch (error) {
    errorResponse({ req, res, error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.context.userId;
    const validatedData = await userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    const updatedUser = await userService.updateUser(userId, validatedData);

    successResponse({
      res,
      data: updatedUser,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    errorResponse({ req, res, error });
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.context.userId;
    const validatedData = await userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    const updatedUser = await userService.updateUserDetails(
      userId,
      validatedData,
    );

    successResponse({
      res,
      data: updatedUser,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    errorResponse({ req, res, error });
  }
};

// export const toggleUserStatus = async (req: Request, res: Response) => {
//     try {
//         const { userId } = req.params;
//         const { approve } = req.body;

//         if (typeof approve !== 'boolean') {
//             return errorResponse({
//                 req,
//                 res,
//                 error: 'approve parameter must be a boolean',
//                 statusCode: 400
//             });
//         }

//         const updatedUser = await userService.toggleUserStatus(userId, approve);

//         return successResponse({
//             res,
//             data: updatedUser,
//             message: `User status successfully changed to ${updatedUser.status}`
//         });
//     } catch (error) {
//         errorResponse({ req, res, error });
//     }
// };
