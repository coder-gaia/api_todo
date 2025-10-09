import { Router } from 'express';
import { createBoard } from '../controllers/boardController';
import { addMember, authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createBoard);
router.post('/:boardId/members', authMiddleware, addMember);

export default router;
