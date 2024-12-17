const REDIS_AUTH = {
   FAILED_LOGIN_ATTEMPTS: 'auth:failed_login_attempts:',
   USER_VERIFIED_CODE: 'auth:user_verified_code:',
   AUTH_ACCESS_TOKEN: 'auth:access_token:',
   AUTH_REFRESH_TOKEN: 'auth:refresh_token:',
   VERIFIED_CODE_RESET_PASSWORD: 'auth:reset_password:',
} as const;

export const EX_VERIFIED_CODE = 300;
export const EX_VERIFIED_RESET_PASSWORD_CODE = 300;
export const EX_ACCESS_TOKEN = 3600;

export { REDIS_AUTH };
