import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export async function createBoard(req: AuthRequest, res: Response) {
  const { title, description } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!title) return res.status(400).json({ message: 'Title required' });
  if (req.user.role !== 'OWNER') return res.status(403).json({ message: 'Only owner can create boards' });

  const board = await prisma.board.create({
    data: {
      title,
      description: description ?? '',
      ownerId: req.user.userId,
      members: { create: { userId: req.user.userId, role: Role.OWNER } }
    },
    include: { members: true }
  });

  return res.status(201).json(board);
}

export async function listBoards(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: req.user.userId },
        { members: { some: { userId: req.user.userId } } }
      ]
    },
    include: { members: true }
  });

  return res.json(boards);
}

export async function addMember(req: AuthRequest, res: Response) {
  const { boardId } = req.params;
  const { userId, role } = req.body;

  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!boardId) return res.status(400).json({ message: 'boardId is required' });
  if (!userId || !role) return res.status(400).json({ message: 'userId and role required' });
  if (!Object.values(Role).includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  if (req.user.userId !== board.ownerId || req.user.role !== 'OWNER') {
    return res.status(403).json({ message: 'Only the owner can assign roles' });
  }

  if (role === 'OWNER') {
    return res.status(403).json({ message: 'Cannot assign OWNER role' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const membership = await prisma.boardMember.upsert({
    where: { boardId_userId: { boardId: boardId!, userId: userId! } },
    update: { role: role as Role },
    create: { boardId: boardId!, userId: userId!, role: role as Role }
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role }
  });

  return res.status(201).json({ membership, user: updatedUser });
}

export async function removeMember(req: AuthRequest, res: Response) {
  const { boardId, userId } = req.params as { boardId: string; userId: string };
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  if (req.user.userId !== board.ownerId) {
    return res.status(403).json({ message: 'Only owner can remove members' });
  }

  await prisma.boardMember.deleteMany({ where: { boardId, userId } });
  return res.status(204).send();
}

export async function addMemberByEmail(req: AuthRequest, res: Response) {
  const { boardId } = req.params;
  const { email, role } = req.body;

  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!boardId) return res.status(400).json({ message: 'boardId is required' });
  if (!email || !role) return res.status(400).json({ message: 'email and role required' });
  if (!Object.values(Role).includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  if (req.user.userId !== board.ownerId || req.user.role !== 'OWNER') {
    return res.status(403).json({ message: 'Only the owner can assign roles' });
  }

  if (role === 'OWNER') {
    return res.status(403).json({ message: 'Cannot assign OWNER role' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const membership = await prisma.boardMember.upsert({
    where: { boardId_userId: { boardId: boardId!, userId: user.id } },
    update: { role: role as Role },
    create: { boardId: boardId!, userId: user.id, role: role as Role }
  });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: role as Role }
  });

  return res.status(201).json({ membership, user: updatedUser });
}
