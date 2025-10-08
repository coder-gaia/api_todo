import { PrismaClient } from '@prisma/client';
import { TaskPayload } from '../models/task';

const prisma = new PrismaClient();

export async function findAll(filters?: { status?: string; search?: string }) {
  return prisma.task.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.search
        ? { title: { contains: filters.search} }
        : {}),
    },
  });
}

export async function findById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function create(payload: TaskPayload) {
  return prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description ?? '',
      status: payload.status ?? 'todo',
      priority: payload.priority ?? 'medium',
    },
  });
}

export async function update(id: string, payload: Partial<TaskPayload>) {
  const data: any = {};
  if (payload.title) data.title = payload.title;
  if (payload.description) data.description = payload.description;
  if (payload.status) data.status = payload.status;
  if (payload.priority) data.priority = payload.priority;

  return prisma.task.update({
    where: { id },
    data,
  });
}


export async function remove(id: string) {
  await prisma.task.delete({ where: { id } });
  return true;
}
