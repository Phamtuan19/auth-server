import { Request, Response } from 'express';

import { UserDocument, UserModel } from '../model';
import { EX_VERIFIED_RESET_PASSWORD_CODE, REDIS_AUTH } from '../auth.constant';

import { RefreshVerifyCodeAccountSchema, ResetPasswordSchema } from './auth-controller.validation';

import HTTPSTATUSCODES from '~/configs/httpStatus';
import { responseError } from '~/configs/response';
import redisClient from '~/database/redisdb';

/**
 * @method [POST]
 * @path /api/auth/get-code-reset-password/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(refreshVerifyCodeAccountSchema)
 *    - Request: accountName
 * @controller getCodeResetPassword
 */

const getCodeResetPassword = async (req: Request<unknown, unknown, RefreshVerifyCodeAccountSchema>, res: Response) => {
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

      const code = Math.floor(Math.random() * 90000) + 10000;

      await redisClient.set(
         `${REDIS_AUTH.VERIFIED_CODE_RESET_PASSWORD}${user._id}`,
         JSON.stringify({
            code: code,
            email: user.email,
            fullName: user.fullName,
            ex: EX_VERIFIED_RESET_PASSWORD_CODE,
            _id: user._id,
         }),
         { EX: EX_VERIFIED_RESET_PASSWORD_CODE },
      );

      const dataResponse = {
         data: {
            _id: user._id,
         },
         message: 'Yêu cầu lấy mã thành công.',
         status: HTTPSTATUSCODES.SUCCESS,
         success: true,
      };

      return responseError(res, dataResponse, HTTPSTATUSCODES.SUCCESS);
   } catch (error) {
      return responseError(res, error);
   }
};

const resetPassword = async (req: Request<unknown, unknown, ResetPasswordSchema>, res: Response) => {
   try {
      const { accountName, code, password } = req.body;

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

      const exists = await redisClient.get(`${REDIS_AUTH.VERIFIED_CODE_RESET_PASSWORD}${user._id}`);

      if (!exists) {
         const dataResponse = {
            data: null,
            message: 'Mã xác thực đã hết hạn.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      const codeResetPassword = JSON.parse(exists) as { code: string };

      if (String(code) !== String(codeResetPassword.code)) {
         const dataResponse = {
            data: null,
            message: 'Mã xác thực không chính xác.',
            status: HTTPSTATUSCODES.INVALID_FORMAT,
            success: false,
         };

         return responseError(res, dataResponse, HTTPSTATUSCODES.INVALID_FORMAT);
      }

      user.set({
         password: password,
      });

      await user.save();

      await redisClient.del(`${REDIS_AUTH.VERIFIED_CODE_RESET_PASSWORD}${user._id}`);

      const dataResponse = {
         data: null,
         message: 'Cập nhật mật khẩu thành công.',
         status: HTTPSTATUSCODES.SUCCESS,
         success: false,
      };

      return responseError(res, dataResponse, HTTPSTATUSCODES.SUCCESS);
   } catch (error) {
      return responseError(res, error);
   }
};

export { getCodeResetPassword, resetPassword };
