import { Request, Response } from 'express';
import ApiCallLogService from './apiCallLogs.service';
import { errorResponse, successResponse } from '../../utils/apiResponses';
import { UserRole } from '../user/user.role';

export async function getUserDailyApiCalls(req: Request, res: Response) {
  try {
    const userId = req.context.userId;
    if (!userId) {
      return errorResponse({ req, res, error: 'User not found' });
    }

    const apiCallLogService = ApiCallLogService.getInstance();
    const dailyCalls = await apiCallLogService.getUserDailyApiCalls(userId);
    
    return successResponse({ res, data: dailyCalls });
  } catch (error) {
    console.error('Error getting user daily API calls:', error);
    return errorResponse({ req, res, error });
  }
}

export async function getTotalDailyApiCalls(req: Request, res: Response) {
  try {
    if (req.context.role !== UserRole.ADMIN) {
      return errorResponse({ req, res, error: 'Unauthorized', statusCode: 401 });
    }

    const apiCallLogService = ApiCallLogService.getInstance();
    const dailyCalls = await apiCallLogService.getTotalDailyApiCalls();
    
    return successResponse({ res, data: dailyCalls });
  } catch (error) {
    console.error('Error getting total daily API calls:', error);
    return errorResponse({ req, res, error });
  }
}
