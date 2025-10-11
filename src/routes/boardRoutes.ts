import { Router } from 'express';
import { addMember, addMemberByEmail, createBoard, listBoards } from '../controllers/boardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, listBoards);
router.post('/', authMiddleware, createBoard);
router.post('/:boardId/members', authMiddleware, addMember);
router.post('/:boardId/members-by-email', authMiddleware, addMemberByEmail);

export default router;
