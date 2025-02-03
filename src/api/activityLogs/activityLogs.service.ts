import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { ActivityLog } from './activityLogs.model';
import { ActivityLogType } from '../../types/enums';
import log from '../../utils/logger';

const activityLogRepository: Repository<ActivityLog> = AppDataSource.getRepository(ActivityLog);

export class ActivityLogService {
  static async logActivity(
    userId: string,
    activityType: ActivityLogType,
    metadata?: Record<string, any>
  ): Promise<ActivityLog> {
    try {
      const activityLog = activityLogRepository.create({
        userId,
        activityType,
        metadata,
        activityDate: new Date()
      });

      return await activityLogRepository.save(activityLog);
    } catch (error) {
      log.error('Error creating activity log:', error);
      throw error;
    }
  }

  static async getUserActivities(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ activities: ActivityLog[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;

      const [activities, total] = await activityLogRepository.findAndCount({
        where: { userId },
        relations: ['user'],
        skip,
        take: limit,
        order: {
          activityDate: 'DESC'
        }
      });

      return {
        activities,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + limit < total
        }
      };
    } catch (error) {
      log.error('Error fetching user activities:', error);
      throw error;
    }
  }

  static async getAllActivities(
    page: number = 1,
    limit: number = 10
  ): Promise<{ activities: ActivityLog[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;

      const [activities, total] = await activityLogRepository.findAndCount({
        relations: ['user'],
        skip,
        take: limit,
        order: {
          activityDate: 'DESC'
        }
      });

      return {
        activities,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + limit < total
        }
      };
    } catch (error) {
      log.error('Error fetching all activities:', error);
      throw error;
    }
  }
}
