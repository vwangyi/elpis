import Router from '@koa/router';
import todoController from '../controller/todoController.js';
const router = new Router();

router.post('/api/todo/list/:id', todoController.getTodoList);

export default router;
