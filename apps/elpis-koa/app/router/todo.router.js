import Router from '@koa/router';
import todoController from '../controller/todoController.js';
const router = new Router();

router.get('/todo', todoController.getTodoList);

export default router;
