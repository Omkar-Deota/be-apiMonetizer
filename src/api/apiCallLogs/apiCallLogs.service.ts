import ApiCallLog from './apiCallLogs.model';
import { AppDataSource } from '../../config/database.config';

export const apiCallLogRepository = AppDataSource.getRepository(ApiCallLog);
export default class ApiCallLogService {
  private static instance: ApiCallLogService;
  private constructor() {}

  static getInstance(): ApiCallLogService {
    if (!ApiCallLogService.instance) {
      ApiCallLogService.instance = new ApiCallLogService();
    }
    return ApiCallLogService.instance;
  }

  async logApiCall(userId: string, requestParams: Record<string, any>, ipAddress: string): Promise<void> {
    const apiCallLog = apiCallLogRepository.create({
      userId,
      requestParams,
      ipAddress
    });
    await apiCallLogRepository.save(apiCallLog);
  }

  async getUserDailyApiCalls(userId: string): Promise<{ date: string; count: number }[]> {
    // Generate dates for last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Get actual API call counts
    const result = await apiCallLogRepository
      .createQueryBuilder('api_call_logs')
      .select('DATE(api_call_logs.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('api_call_logs.userId = :userId', { userId })
      .andWhere('api_call_logs.createdAt >= :startDate', { 
        startDate: new Date(dates[0])
      })
      .groupBy('DATE(api_call_logs.createdAt)')
      .getRawMany();

    // Create a map of date to count from actual results
    const countMap = result.reduce((acc, { date, count }) => {
      acc[date.toISOString().split('T')[0]] = parseInt(count);
      return acc;
    }, {} as Record<string, number>);

    // Map all dates to their counts, using 0 for dates with no calls
    return dates.map(date => ({
      date,
      count: countMap[date] || 0
    }));
  }

  async getTotalDailyApiCalls(): Promise<{ date: string; count: number }[]> {
    // Generate dates for last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Get actual API call counts
    const result = await apiCallLogRepository
      .createQueryBuilder('api_call_logs')
      .select('DATE(api_call_logs.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('api_call_logs.createdAt >= :startDate', { 
        startDate: new Date(dates[0])
      })
      .groupBy('DATE(api_call_logs.createdAt)')
      .getRawMany();

    // Create a map of date to count from actual results
    const countMap = result.reduce((acc, { date, count }) => {
      acc[date.toISOString().split('T')[0]] = parseInt(count);
      return acc;
    }, {} as Record<string, number>);

    // Map all dates to their counts, using 0 for dates with no calls
    return dates.map(date => ({
      date,
      count: countMap[date] || 0
    }));
  }
}
