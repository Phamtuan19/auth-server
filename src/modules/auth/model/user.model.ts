/**
 * Model dành cho quản trị viên, nhân viên, và người dùng
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { UserDocument } from './user.interface';

import envConfig from '~/configs/envConfig';

const UserSchema = new mongoose.Schema<UserDocument>(
   {
      fullName: {
         type: String,
         required: true,
      },
      userName: {
         type: String,
         unique: true,
         sparse: true,
      },
      email: {
         type: String,
         unique: true,
         sparse: true,
         required: true,
      },
      password: {
         type: String,
         required: true,
         min: 6,
      },
      provider: {
         type: String,
         enum: ['Google', 'Facebook'],
         default: null,
      },
      provider_account_id: {
         type: String,
         default: null,
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      isLock: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   },
);

UserSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      return next();
   }

   if (this.password) {
      const saltPrefix =
         envConfig.USER_BCRYPT_NUMBER === 'a' || envConfig.USER_BCRYPT_NUMBER === 'b'
            ? envConfig.USER_BCRYPT_NUMBER
            : undefined;
      const salt = bcrypt.genSaltSync(envConfig.USER_BCRYPT_ROUNDS, saltPrefix);

      const hash = await bcrypt.hash(this.password, salt);

      this.password = hash;
   }
   return next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
   return await bcrypt.compare(password, this.password as string);
};

UserSchema.plugin(mongooseAutoPopulate);
UserSchema.plugin(mongooseLeanVirtuals);

const UserModel = mongoose.model<UserDocument>('USERS', UserSchema);

export default UserModel;
