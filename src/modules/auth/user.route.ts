import express from 'express';

import {
   getCodeResetPassword,
   mailVerifyAccount,
   refreshVerifyCodeAccountSchema,
   register,
   registerSchema,
   resetPassword,
   signin,
   verifyAccount,
   verifyAccountSchema,
} from './controller';

import envConfig from '~/configs/envConfig';
import validateResource from '~/helpers/validate-resource';

const authRouter = express.Router();

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/signin/v1.0
 * @description Endpoint for client sign-in.
 * @controller signin
 */
authRouter.post(`/signin/${envConfig.API_VERSION}`, signin);

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/register/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(registerSchema)
 * @controller register
 */
authRouter.post(`/register/${envConfig.API_VERSION}`, validateResource(registerSchema), register);

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/refresh/verify-code-account/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(refreshVerifyCodeAccountSchema)
 * @controller mailVerifyAccount
 */
authRouter.post(
   `/refresh/verify-code-account/${envConfig.API_VERSION}`,
   validateResource(refreshVerifyCodeAccountSchema),
   mailVerifyAccount,
);

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/verify-code-account/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(verifyAccountSchema)
 * @controller verifyAccount
 */
authRouter.post(`/verify-code-account/${envConfig.API_VERSION}`, validateResource(verifyAccountSchema), verifyAccount);

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/get-code-reset-password/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(refreshVerifyCodeAccountSchema)
 * @controller getCodeResetPassword
 */
authRouter.post(
   `/get-code-reset-password/${envConfig.API_VERSION}`,
   validateResource(refreshVerifyCodeAccountSchema),
   getCodeResetPassword,
);

/**
 * @method [POST]
 * @path /api/module/auth-server/auth/reset-password/v1.0
 * @description Endpoint for client registration.
 * @middleware validateResource(refreshVerifyCodeAccountSchema)
 * @controller getCodeResetPassword
 */
authRouter.post(
   `/reset-password/${envConfig.API_VERSION}`,
   validateResource(refreshVerifyCodeAccountSchema),
   resetPassword,
);

export default authRouter;
