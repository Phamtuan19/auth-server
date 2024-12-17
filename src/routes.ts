import { RouterGroup } from './configs/interface';
import authRouter from './modules/auth/user.route';

const routes: RouterGroup[] = [
   {
      prefix: '/auth',
      routes: [
         {
            path: '',
            route: authRouter,
         },
      ],
   },
];

export default routes;
