import { PrismaClient } from '@prisma/client';
import { TaskPayload } from '../models/task';

const prisma = new PrismaClient();

export async function findAll(filters?: { status?: string; search?: string; boardId?: string }) {
  return prisma.task.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.search ? { title: { contains: filters.search } } : {}),
      ...(filters?.boardId ? { boardId: filters.boardId } : {}),
    },
  });
}

export async function findById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function create(payload: TaskPayload & { boardId: string; ownerId?: string | null }) {
  return prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description ?? '',
      status: payload.status ?? 'todo',
      priority: payload.priority ?? 'medium',
      boardId: payload.boardId,
      ownerId: payload.ownerId ?? null,
    },
  });
}

export async function update(id: string, payload: Partial<TaskPayload>) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  const data: any = {};
  if (payload.title !== undefined) data.title = payload.title;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.priority !== undefined) data.priority = payload.priority;
  return prisma.task.update({ where: { id }, data });
}

export async function remove(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  await prisma.task.delete({ where: { id } });
  return true;
}
