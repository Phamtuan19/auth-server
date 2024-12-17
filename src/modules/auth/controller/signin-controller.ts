/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserDocument, UserModel } from '../model';
import { EX_ACCESS_TOKEN, EX_VERIFIED_CODE, REDIS_AUTH } from '../auth.constant';

import { SigninSchema } from './auth-controller.validation';

import { responseError, responseSuccess } from '~/configs/response';
import HTTPSTATUSCODES from '~/configs/httpStatus';
import redisClient from '~/database/redisdb';
import envConfig from '~/configs/envConfig';

/**
 *
 * [POST]: /api/auth/signin/v1.0
 *
 */

const MAX_ATTEMPTS = 5;
const LOCK_TIME = EX_VERIFIED_CODE;

const signin = async (req: Request<unknown, unknown, SigninSchema>, res: Response) => {
   try {
      const { accountName, password } = req.body;

      const searchQuery = {
         $or: [{ email: accountName }, { userName: accountName }],
      };

      const user = await UserModel.findOne<UserDocument>(searchQuery).exec();

      if (!user) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản hoặc email đăng nhập không tồn tại.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      if (!user.isVerified) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản chưa được xác thực.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      if (user.isLock) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản đã bị khóa.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      // Kiểm tra nếu tài khoản đang bị khóa
      const attempts = await redisClient.get(`${REDIS_AUTH.FAILED_LOGIN_ATTEMPTS}${user._id}`);

      if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
         const dataResponse = {
            data: null,
            message: `Tài khoản đã bị khóa. Vui lòng thử lại sau.`,
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };
         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      const isCheck = await user.comparePassword(password);

      if (!isCheck) {
         // Tăng số lần đăng nhập sai
         await redisClient.incr(`${REDIS_AUTH.FAILED_LOGIN_ATTEMPTS}${user._id}`);

         // Thiết lập thời gian hết hạn nếu chưa có
         const ttl = await redisClient.ttl(`${REDIS_AUTH.FAILED_LOGIN_ATTEMPTS}${user._id}`);
         if (ttl === -1) {
            await redisClient.expire(`${REDIS_AUTH.FAILED_LOGIN_ATTEMPTS}${user._id}`, LOCK_TIME);
         }

         const remainingAttempts = MAX_ATTEMPTS - ((attempts ? parseInt(attempts) : 0) + 1);

         const dataResponse = {
            data: null,
            message: `Mật khẩu không chính xác. Bạn còn ${remainingAttempts} lần thử.`,
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };
         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      // Đăng nhập thành công, xóa số lần đăng nhập sai
      await redisClient.del(`${REDIS_AUTH.FAILED_LOGIN_ATTEMPTS}${user._id}`);

      const {
         password: userPassword,
         isVerified,
         isLock,
         provider,
         provider_account_id,
         ...publicUserData
      } = user.toObject() as UserDocument;

      if (!envConfig.ACCESS_TOKEN_SECRET_KEY) {
         throw new Error('Private key is not defined in environment variables.');
      }

      const access_token = jwt.sign({ _id: publicUserData._id, email: user.email }, envConfig.ACCESS_TOKEN_SECRET_KEY, {
         expiresIn: '1h',
      });

      await redisClient.set(`${REDIS_AUTH.AUTH_ACCESS_TOKEN}${access_token}`, JSON.stringify(publicUserData), {
         EX: EX_ACCESS_TOKEN,
      });

      const dataResponse = {
         data: {
            ...publicUserData,
            accessToken: access_token,
         },
         message: 'Đăng nhập thành công',
         status: HTTPSTATUSCODES.SUCCESS,
         success: true,
      };

      return responseSuccess(res, dataResponse);
   } catch (error) {
      return responseError(res, error);
   }
};

/**
 *
 * [POST]: /api/
 *
 */

export { signin };
