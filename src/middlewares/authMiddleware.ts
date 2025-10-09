import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role?: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Invalid Authorization header format' });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not defined' });
  }

  let payload: unknown;

  try {
    payload = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (typeof payload !== 'object' || payload === null) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = payload as { userId: string; username: string; role?: string };
  next();
}

export async function addMember(req: Request<{ boardId: string }>, res: Response) {
  const { boardId } = req.params;
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: 'userId and role are required' });
  }

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const member = await prisma.boardMember.create({
    data: {
      boardId,
      userId,
      role: role as Role,
    },
  });

  return res.status(201).json(member);
}