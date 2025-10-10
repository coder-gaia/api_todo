import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireAdminOrOwnerForTask } from '../middlewares/roleMiddleware';
import { createTask, updateTask, deleteTask, listTasks, getTask } from '../controllers/taskController';

const router = Router();

router.get('/', authMiddleware, listTasks);
router.get('/:id', authMiddleware, getTask);

router.post('/', authMiddleware, requireAdminOrOwnerForTask(), createTask);
router.put('/:id', authMiddleware, requireAdminOrOwnerForTask(), updateTask);
router.delete('/:id', authMiddleware, requireAdminOrOwnerForTask(), deleteTask);

export default router;
