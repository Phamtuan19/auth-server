import { Router } from 'express';
import { HttpStatusCodeType } from './httpStatus';

export interface ResponseSuccess<T = object> {
   status: HttpStatusCodeType;
   success: boolean;
   message: string;
   data: T | null;
}

export interface ResponsePaginationSuccess<T = object> {
   status: HttpStatusCodeType;
   success: boolean;
   message: string;
   data: {
      data: T[] | null;
      currentPage: number;
      totalPage: number;
      limit: number;
      nextPage: boolean;
      previousPage: boolean;
   };
}

export interface DataError {
   type: 'validate';
}

export interface Routes {
   path: string;
   route: Router;
}

export interface RouterGroup {
   prefix: string;
   routes: Routes[];
}
