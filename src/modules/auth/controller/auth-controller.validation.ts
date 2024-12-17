import { z } from 'zod';

import { regexs } from '~/configs/constants';

/**
 *
 * validate
 * body api signin
 *
 */

export const registerSchema = z.object({
   body: z.object({
      fullName: z.string({
         required_error: 'Tên người dùng không được để trống',
      }),
      userName: z.string({
         required_error: 'Tài khoản không được để trống',
      }),
      email: z
         .string({
            required_error: 'Email Không được để trống',
         })
         .regex(regexs.email, 'Email Không đúng định dạng'),
      password: z
         .string({
            required_error: 'Mật khẩu không được để trống',
         })
         .min(6, 'Mật khẩu phải nhiều hơn 6 ký tự'),
   }),
});

export type RegisterSchema = z.TypeOf<typeof registerSchema>['body'];

/**
 *
 * validate
 * body api signin
 *
 */

export const signinSchema = z.object({
   body: z.object({
      accountName: z.string({
         required_error: 'Tài khoản không được để trống',
      }),
      password: z
         .string({
            required_error: 'Mật khẩu không được để trống',
         })
         .min(6, 'Mật khẩu phải nhiều hơn 6 ký tự'),
   }),
});

export type SigninSchema = z.TypeOf<typeof signinSchema>['body'];

export const refreshVerifyCodeAccountSchema = z.object({
   body: z.object({
      accountName: z.string({
         required_error: 'Tài khoản không được để trống',
      }),
   }),
});

export type RefreshVerifyCodeAccountSchema = z.TypeOf<typeof refreshVerifyCodeAccountSchema>['body'];

export const verifyAccountSchema = z.object({
   body: z.object({
      accountName: z.string({
         required_error: 'Tài khoản không được để trống',
      }),
      code: z
         .string({
            required_error: 'Tài khoản không được để trống',
         })
         .length(5, {
            message: 'Mã xác thực không đúng số lượng.',
         }),
   }),
});

export type VerifyAccountSchema = z.TypeOf<typeof verifyAccountSchema>['body'];

export const resetPasswordSchema = z.object({
   body: z.object({
      accountName: z.string({
         required_error: 'Tài khoản không được để trống',
      }),
      password: z
         .string({
            required_error: 'Mật khẩu không được để trống',
         })
         .min(6, 'Mật khẩu phải nhiều hơn 6 ký tự'),
      code: z
         .string({
            required_error: 'Tài khoản không được để trống',
         })
         .length(5, {
            message: 'Mã xác thực không đúng số lượng.',
         }),
   }),
});

export type ResetPasswordSchema = z.TypeOf<typeof resetPasswordSchema>['body'];
