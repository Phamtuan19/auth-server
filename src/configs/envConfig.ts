import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
   APP_PORT: process.env.APP_PORT,
   ACCESS_TOKEN_SECRET_KEY: String(process.env.ACCESS_TOKEN_SECRET_KEY),
   REFRESH_TOKEN_SECRET_KEY: String(process.env.REFRESH_TOKEN_SECRET_KEY),
   USER_BCRYPT_ROUNDS: Number(process.env.USER_BCRYPT_ROUNDS),
   USER_BCRYPT_NUMBER: process.env.USER_BCRYPT_NUMBER,
   API_VERSION: process.env.API_VERSION,
} as const;

export default envConfig;
