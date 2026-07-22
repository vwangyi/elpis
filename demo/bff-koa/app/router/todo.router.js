import Router from '@koa/router';
import todoController from '../controller/todoController.js';
const router = new Router();

router.post('/api/todo/create', todoController.create);
router.get('/api/todo/list', todoController.findAll);

export default router;
