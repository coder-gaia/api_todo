import { Router } from 'express';
import { addMember, createBoard } from '../controllers/boardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createBoard);
router.post('/:boardId/members', authMiddleware, addMember);

export default router;
