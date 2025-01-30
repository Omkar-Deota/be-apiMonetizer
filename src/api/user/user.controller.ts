import { Request, Response } from 'express';
import log from '../../utils/logger';

export const getAllUser = (req: Request, res: Response) => {
  log.info('Get all user info');
};
