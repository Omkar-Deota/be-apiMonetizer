import { Request, Response } from 'express';

export interface IErrorResponse {
  success: false;
  error?: any;
}

export interface IErrorResponseParameters {
  req: Request;
  res: Response;
  error?: any;
  statusCode?: number;
}

export interface ISuccessResponse {
  success: true;
  data?: object | Array<object>;
  message?: string;
  size?: number;
  totalPages?: number;
  count?: number;
  hasMore?: boolean;
}

export interface ISuccessResponseParameters {
  res: Response;
  data?: object | Array<object>;
  message?: string;
  statusCode?: number;
  totalPages?: number;
  count?: number;
  hasMore?: boolean;
}
