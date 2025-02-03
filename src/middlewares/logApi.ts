import { NextFunction, Request, Response } from 'express';
import log from '../utils/logger';

export function logApi() {
	return (req: Request, res: Response, next: NextFunction) => {
		log.info(`${req.method} ${req.originalUrl}`);

		next();
	};
}
