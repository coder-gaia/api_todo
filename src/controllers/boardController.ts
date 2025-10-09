import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createBoard(req: AuthRequest, res: Response) {
  const { title, description } = req.body;
  const userId = req.user?.userId;

  if (!title || !userId) return res.status(400).json({ message: 'Title is required' });

  const board = await prisma.board.create({
    data: {
      title,
      description: description ?? '',
      ownerId: userId,
      members: {
        create: {
          userId,
          role: 'OWNER'
        }
      }
    },
    include: { members: true }
  });

  return res.status(201).json(board);
}
