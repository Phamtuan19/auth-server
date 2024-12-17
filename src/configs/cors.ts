import cors from 'cors';

const WHITELIST_DOMAINS: string[] = ['http://localhost:8888'];

export const corsOptions: cors.CorsOptions = {
   origin: (origin, callback) => {
      if (!origin && process.env.BUILD_MODE === 'dev') {
         return callback(null, true);
      }
      if (origin && WHITELIST_DOMAINS.includes(origin)) {
         return callback(null, true);
      }

      return callback(null, false);
   },
   optionsSuccessStatus: 200,
   credentials: false,
   methods: 'GET,PUT,PATCH,POST,DELETE',
   allowedHeaders: ['Content-Type', 'Authorization'],
};
