import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  IErrorResponse,
  IErrorResponseParameters,
  ISuccessResponse,
  ISuccessResponseParameters,
} from '../types/api.type';
import log from './logger';

export function errorResponse({
  req,
  res,
  error,
  statusCode = 400,
}: IErrorResponseParameters) {
  const response: IErrorResponse = {
    success: false,
  };
  if (!error) {
    response.error = 'Something went wrong';
    statusCode = 500;
  } else if (typeof error === 'string') {
    response.error = error;
  } else if (error instanceof QueryFailedError) {
    response.error = error.message;
  } else if (error instanceof EntityNotFoundError) {
    response.error = error.message;
  } else if (error instanceof Error) {
    response.error = error.message;
    statusCode = 500;
  }

  log.error(`Error in ${req.originalUrl}: ${response.error}`);

  res.status(statusCode).json(response);
}

export function successResponse({
  res,
  data,
  message = '',
  statusCode = 200,
  totalPages,
  count,
  hasMore,
}: ISuccessResponseParameters) {
  const isDataArray = Array.isArray(data);

  const response: ISuccessResponse = {
    success: true,
  };

  if (data) {
    response.data = data;
  }

  if (isDataArray) {
    response.size = data.length;
  }

  if (message && message.length > 0) {
    response.message = message;
  }

  if (totalPages != undefined) {
    response.totalPages = totalPages;
  }

  if (count != undefined) {
    response.count = count;
  }

  if (hasMore != undefined) {
    response.hasMore = hasMore;
  }

  res.status(statusCode).json(response);
}
