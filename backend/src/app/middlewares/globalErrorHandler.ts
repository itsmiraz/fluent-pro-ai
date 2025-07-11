/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interfaces/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something Went Wrong';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something Went Wrong',
    },
  ];

  // Checks the error is zod is not
  if (err instanceof ZodError) {
    const simplifierError = handleZodError(err);
    statusCode = simplifierError.statusCode;
    message = simplifierError.message;
    errorSource = simplifierError.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifierError = handleValidationError(err);
    statusCode = simplifierError.statusCode;
    message = simplifierError.message;
    errorSource = simplifierError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifierError = handleCastError(err);
    statusCode = simplifierError.statusCode;
    message = simplifierError.message;
    errorSource = simplifierError.errorSources;
  } else if (err?.code === 11000) {
    const simplifierError = handleDuplicateError(err);
    statusCode = simplifierError.statusCode;
    message = simplifierError.message;
    errorSource = simplifierError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  }
  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSource,

    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
