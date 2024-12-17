/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
   socket: {
      host: process.env.REDIS_SECURITY_HOST,
      port: Number(process.env.REDIS_SECURITY_PORT),
   },
   password: process.env.REDIS_SECURITY_PASSWORD,
});

redisClient
   .connect()
   .then(() => {
      console.log('[SUCCESS] ::: Connected to Redis');
   })
   .catch((error) => {
      console.log('[ERROR] ::: ', error.message);
   });

redisClient.on('error', (error) => {
   console.log(error.message);
});

export default redisClient;
