import { Request, Response } from 'express';
import { ActivityLogService } from './activityLogs.service';
import log from '../../utils/logger';
import { UserRole } from '../user/user.role';
import { errorResponse, successResponse } from '../../utils/apiResponses';

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.context.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return errorResponse({ req, res, error: 'User not authenticated' });
    }

    const result = await ActivityLogService.getUserActivities(userId, page, limit);

    return successResponse({ res, data: result });
  } catch (error) {
    log.error('Error in getUserActivities:', error);
    return errorResponse({ req, res, error });
  }
};

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    // Check if user is admin (you might want to add this check based on your auth system)
    if (!req.context.role || req.context.role !== UserRole.ADMIN) {
      return errorResponse({ req, res, error: 'Unauthorized: User is not an admin' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await ActivityLogService.getAllActivities(page, limit);
    return successResponse({ res, data: result });
  } catch (error) {
    log.error('Error in getAllActivities:', error);
    return errorResponse({ req, res, error });
  }
};
