import { ObjectId } from 'mongoose';

import { PersonnelDocument } from './models/personnel/personnel.schema';

export {};

declare global {
   namespace Express {
      interface Request {
         auth?: PersonnelDocument;
         query?: Record<string, string | number>;
         params?: {
            q?: string;
            field?: string;
            id?: ObjectId;
         };
         body?: z.infer<typeof createUserSchema>['body'];
         query?: z.infer<typeof createUserSchema>['query'];
         params?: z.infer<typeof createUserSchema>['params'];
      }
   }
}
