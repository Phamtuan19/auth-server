import { Request, Response } from 'express';

import { UserDocument, UserModel } from '../model';
import { EX_VERIFIED_CODE, REDIS_AUTH } from '../auth.constant';
import { UserVerifyCodeMailType } from '../auth.interface';

import { RefreshVerifyCodeAccountSchema, RegisterSchema, VerifyAccountSchema } from './auth-controller.validation';

import HTTPSTATUSCODES from '~/configs/httpStatus';
import { responseError, responseSuccess } from '~/configs/response';
import redisClient from '~/database/redisdb';

const register = async (req: Request<unknown, unknown, RegisterSchema>, res: Response) => {
   try {
      const { email, password, userName, fullName } = req.body;

      const searchQuery = {
         $or: [{ email: email }, { userName: userName }],
      };

      const user = await UserModel.findOne<UserDocument>(searchQuery);

      if (user) {
         const errorValidate: Record<string, string> = {};

         if (user.userName === userName) {
            errorValidate.userName = 'Tài khoản đăng nhập đã tồn tại';
         }

         errorValidate.email = 'Email tài khoản đã tồn tại.';

         const responseValidate = {
            success: false,
            message: 'Xác thực thất bại!',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            data: errorValidate,
         };

         return responseError(res, responseValidate, HTTPSTATUSCODES.SUCCESS);
      }

      const dataCreateUser = {
         fullName,
         email,
         userName,
         password,
         isLock: false,
         isVerified: false,
      };

      const userData: UserDocument = await UserModel.create(dataCreateUser);

      const code = Math.floor(Math.random() * 90000) + 10000;

      await redisClient.set(
         `${REDIS_AUTH.USER_VERIFIED_CODE}${userData._id}`,
         JSON.stringify({
            code,
            email,
            fullName,
            ex: EX_VERIFIED_CODE,
            _id: userData._id,
         }),
         {
            EX: EX_VERIFIED_CODE,
         },
      );

      const dataResponse = {
         data: {
            _id: userData._id,
         },
         message: 'Đăng ký tài khoản thành công',
         status: HTTPSTATUSCODES.SUCCESS,
         success: true,
      };

      return responseSuccess(res, dataResponse);
   } catch (error) {
      const dataResponseError = {
         success: false,
         message: 'Đã có lỗi xảy ra.',
         status: HTTPSTATUSCODES.BAD_REQUEST,
         data: error,
      };
      return responseError(res, dataResponseError, HTTPSTATUSCODES.BAD_REQUEST);
   }
};

/**
 *
 * [POST]: /api/
 *
 */

const mailVerifyAccount = async (req: Request<unknown, unknown, RefreshVerifyCodeAccountSchema>, res: Response) => {
   try {
      const { accountName } = req.body;

      const searchQuery = {
         $or: [{ email: accountName }, { userName: accountName }],
      };

      const user = await UserModel.findOne<UserDocument>(searchQuery).exec();

      if (!user) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản hoặc email không tồn tại.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      const redisKey = `${REDIS_AUTH.USER_VERIFIED_CODE}${user?._id}`;

      // Kiểm tra sự tồn tại của key trong Redis
      const exists = await redisClient.exists(redisKey);

      const code = Math.floor(Math.random() * 90000) + 10000;

      if (exists) {
         // Nếu key đã tồn tại, lấy dữ liệu cũ và cập nhật
         const currentData = await redisClient.get(redisKey);

         if (currentData) {
            const parsedData = JSON.parse(currentData) as UserVerifyCodeMailType;

            // Cập nhật các trường cần thiết
            parsedData.code = code;
            parsedData.ex = EX_VERIFIED_CODE;

            await redisClient.set(redisKey, JSON.stringify(parsedData), { EX: EX_VERIFIED_CODE });
         }
      } else {
         await redisClient.set(
            redisKey,
            JSON.stringify({
               code,
               email: user.email,
               fullName: user.fullName,
               ex: EX_VERIFIED_CODE,
            }),
            { EX: EX_VERIFIED_CODE },
         );
      }

      const dataResponse = {
         data: {
            _id: user?._id,
         },
         message: 'Yêu cầu gửi mã xác thực thành công.',
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

const verifyAccount = async (req: Request<unknown, unknown, VerifyAccountSchema>, res: Response) => {
   try {
      const { accountName, code: reqCode } = req.body;

      const searchQuery = {
         $or: [{ email: accountName }, { userName: accountName }],
      };

      const user = await UserModel.findOne<UserDocument>(searchQuery).exec();

      if (!user) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản hoặc email không tồn tại.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      if (user.isVerified) {
         const dataResponse = {
            data: null,
            message: 'Tài khoản đã được xác thực.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      const redisKey = `${REDIS_AUTH.USER_VERIFIED_CODE}${user._id}`;

      // Kiểm tra sự tồn tại của key trong Redis
      const exists = await redisClient.get(redisKey);

      if (!exists) {
         const dataResponse = {
            data: null,
            message: 'Mã xác thực đã hết hạn.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      const { code } = JSON.parse(exists) as UserVerifyCodeMailType;

      if (String(code) !== String(reqCode)) {
         const dataResponse = {
            data: null,
            message: 'Mã xác thực không chính xác.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      user.set({
         isVerified: true,
      });

      await user.save();

      await redisClient.del(redisKey);

      const dataResponse = {
         data: null,
         message: 'Xác thực tài khoản thành công.',
         status: HTTPSTATUSCODES.SUCCESS,
         success: false,
      };

      return responseError(res, dataResponse, HTTPSTATUSCODES.SUCCESS);
   } catch (error) {
      return responseError(res, error);
   }
};

export { mailVerifyAccount, register, verifyAccount };
