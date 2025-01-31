import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import env from '../../config/environment.config';
import log from '../../utils/logger';
import { errorResponse } from '../../utils/apiResponse';
import { UserRole } from '../../types/enums';
import userService from '../user/user.service';
import { RequestContext } from './auth.context';

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}

export const auth0 = auth({
  audience: env.auth0.audience,
  issuerBaseURL: `https://${env.auth0.domain}/`,
  tokenSigningAlg: env.auth0.tokenSigningAlgo,
});
export const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new Promise<void>((resolve, reject) => {
        verifyAuth0(req, res, (err) => {
          if (err) {
            return reject(err instanceof Error ? err : new Error(String(err)));
          }
          resolve();
        });
      });
      // Inject RequestContext to all valid Request
      await new Promise<void>((resolve, reject) => {
        injectContext(req, res, (err) => {
          if (err) {
            return reject(err instanceof Error ? err : new Error(String(err)));
          }
          resolve();
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

const injectContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  log.info(`${req.method} ${req.originalUrl}, inject context`);

  if (req.auth?.payload?.sub) {
    const externalId = req.auth.payload.sub;
    log.info(`externalId: ${externalId}`);

    const user = await userService.findUserByExternalId(externalId);

    if (user) {
      req.context = {
        email: user.email,
        userId: user.id,
        role: user.role,
        authExternalId: user.authExternalId,
        emailVerified: user.emailVerified || false,
      };
      next();

      return;
    }
  } else {
    errorResponse({ req, res, error: 'Invalid Access login', statusCode: 401 });
  }
};

export const isAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    log.info(`${req.method} ${req.originalUrl}, Admin check`);
    const userRole = req?.context?.role;

    if (!userRole) {
      errorResponse({
        req,
        res,
        error: 'Unauthorized: No user role found in request',
        statusCode: 401,
      });
      return;
    }

    if (userRole === UserRole.ADMIN) {
      next();
      return;
    }

    errorResponse({
      req,
      res,
      error: 'Forbidden: You do not have access to this resource',
      statusCode: 403,
    });
  };
};

export const isSelfOrAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    log.info(`${req.method} ${req.originalUrl}, is self or admin`);
    const { id = '' } = req.params;
    const userRole = req?.context?.role;
    const userId = req?.context?.userId;
    if (!id || !userId || !userRole) {
      errorResponse({
        req,
        res,
        error: 'Something went wrong, cannot give access',
        statusCode: 500,
      });
      return;
    }

    if (userRole === UserRole.ADMIN) {
      next();
      return;
    }

    if (id !== userId) {
      errorResponse({
        req,
        res,
        error: 'Not authorized to access this route',
        statusCode: 400,
      });
      return;
    }

    next();
  };
};

const verifyAuth0 = (req: Request, res: Response, next: NextFunction) => {
  log.info(`${req.method} ${req.originalUrl}, auth0 middleware`);

  auth0(req, res, (error) => {
    if (error) {
      errorResponse({ req, res, error, statusCode: 401 });

      return;
    }
    next();
  });
};

export const apiKeyMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    log.info('API key signup');
    const AUTH_HEADER = 'SP-API-KEY';

    const apiKeyVal = req.header(AUTH_HEADER);

    if (!apiKeyVal) {
      res.status(401).send('Api Key not found!');
      return;
    }

    const apiKey = env.app.apiSecret;

    if (!apiKey) {
      res.status(500).send('Internal Server Error');
      errorResponse({
        req,
        res,
        error: 'Internal Server Error',
        statusCode: 500,
      });
    } else if (apiKey !== apiKeyVal) {
      res.status(401).send('Unauthorized error');
      errorResponse({
        req,
        res,
        error: 'Unauthorized client',
        statusCode: 401,
      });
    } else {
      (req as any).admin = {
        identity: {
          name: apiKeyVal,
          authenticationType: AUTH_HEADER,
        },
      };
      next();
    }
  };
};
