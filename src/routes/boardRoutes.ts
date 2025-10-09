import { Router } from 'express';
import { createBoard } from '../controllers/boardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createBoard);

export default router;
