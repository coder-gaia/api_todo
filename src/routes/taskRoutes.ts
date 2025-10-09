import { Router } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;
