import { Document } from 'mongoose';

export interface UserModelInput {
   fullName: string;
   email?: string;
   userName: string;
   password: string;
   provider: 'Google' | 'Facebook' | null;
   provider_account_id: string | null;
   isVerified: boolean;
   isLock: boolean;
}

export interface UserDocument extends Document<string>, UserModelInput {
   createdAt: Date;
   updatedAt: Date;
   comparePassword(passwordInput: string): Promise<boolean>;
}
