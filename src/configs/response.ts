/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

import HTTPSTATUSCODES, { HttpStatusCodeType } from './httpStatus';
import { ResponsePaginationSuccess, ResponseSuccess } from './interface';

const responseSuccess = (response: Response, dataResponse: ResponsePaginationSuccess | ResponseSuccess) => {
   return response.status(HTTPSTATUSCODES.SUCCESS).json(dataResponse);
};

const responseError = (
   response: Response,
   dataError: any,
   statusCode: HttpStatusCodeType = HTTPSTATUSCODES.BAD_REQUEST,
) => {
   // if (dataError.code === 11000) {
   //    console.error('🚀 ~ Duplicate key error:', dataError.message);
   // } else if (dataError.name === 'ValidationError') {
   //    console.error('🚀 ~ Validation error:', dataError.message);
   // } else {
   //    console.error('🚀 ~ General error:', dataError.message);
   // }

   return response.status(statusCode).json(dataError);
};

export { responseSuccess, responseError };
