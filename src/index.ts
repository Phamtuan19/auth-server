import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import { corsOptions } from './configs/cors';
import connectMongoDB from './database/mongodb';
import routes from './routes';
import './database/redisdb';

dotenv.config();

const app = express();

const PORT = process.env.APP_PORT;

app.use(cors(corsOptions));

app.use(morgan('tiny'));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ limit: '10mb', extended: true }));

routes.forEach((item) =>
   item.routes.forEach((route) => {
      return app.use('/api/module/auth-server' + item.prefix + route.path, route.route);
   }),
);

app.get('/', (req, res) => {
   res.send('Express on Vercel');
});

// app.post('/api/upload-firebase', multerConfig.array('files'), uploadFirebase);

app.listen(PORT, async () => {
   await connectMongoDB();
   process.env.NODE_ENV === 'production' && console.log(`[SUCCESS] ::: Server is listening on port: ${PORT}`);
});
