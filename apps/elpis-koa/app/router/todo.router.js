import Router from '@koa/router';
import todoController from '../controller/todoController.js';
const router = new Router();

const { findAll } = todoController;
const { create } = todoController;

router.post('/api/todo/create', create.bind(todoController));
router.get('/api/todo/list', findAll.bind(todoController));

export default router;
