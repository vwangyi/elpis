import Router from '@koa/router';
import userController from '../controller/userController.js';
const router = new Router();

router.get('/api/users', userController.getUserList);

export default router;
