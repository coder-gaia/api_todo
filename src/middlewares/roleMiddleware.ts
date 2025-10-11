import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from './authMiddleware';

const prisma = new PrismaClient();

export async function getMembership(boardId: string, userId: string) {
  return prisma.boardMember.findFirst({ where: { boardId, userId } });
}

export function requireOwner() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'OWNER') return res.status(403).json({ message: 'Only OWNER allowed' });
    next();
  };
}

export function requireAdminOrOwnerForTask() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    //console.log('REQ.USER:', req.user, 'BODY.BOARDID:', req.body?.boardId, 'PARAMS.ID:', req.params?.id);
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let boardId: string | null = null;

    if (req.body?.boardId) boardId = req.body.boardId;
    else if (req.params?.id) {
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      boardId = task.boardId;
    }

    if (!boardId) return res.status(400).json({ message: 'Board ID is required' });

    if (req.user.role === 'OWNER') return next();

    if (req.user.role === 'ADMIN') {
      const membership = await prisma.boardMember.findFirst({ where: { boardId, userId: req.user.userId } });
      if (!membership) return res.status(403).json({ message: 'Only OWNER or ADMIN members can modify tasks' });
      return next();
    }

    return res.status(403).json({ message: 'Only OWNER or ADMIN allowed' });
  };
}

