import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/apiResponse';
import userService from './user.service';
import {
  userCreateSchema,
  UserCreateType,
} from './validations/user.validation';

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
