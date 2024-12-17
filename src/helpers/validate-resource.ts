/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import HTTPSTATUSCODES from '~/configs/httpStatus';

const validateResource =
   (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => {
      try {
         schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
         });
         next();
      } catch (error) {
         let errorObject: Record<string, string> | undefined;

         if (error instanceof z.ZodError) {
            errorObject = error.issues.reduce(
               (acc, issue) => {
                  const key = issue.path[1]; // Handle nested keys properly
                  acc[key] = issue.message;
                  return acc;
               },
               {} as Record<string, string>,
            );
         }

         res.status(HTTPSTATUSCODES.INVALID_FORMAT).json({
            success: false,
            message: 'Validation failed',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            data: errorObject || { message: 'An unexpected error occurred' },
         });
      }
   };

export default validateResource;
