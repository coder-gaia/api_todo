import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { AuthRequest } from '../middlewares/authMiddleware';

export async function listTasks(req: Request, res: Response) {
  const { status, search, boardId } = req.query;
  const tasks = await taskService.findAll({
    status: status as string,
    search: search as string,
    boardId: boardId as string,
  });
  return res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const task = await taskService.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json(task);
}

export async function createTask(req: AuthRequest, res: Response) {
  const { title, description, status, priority, boardId } = req.body;
  const ownerId: string | null = req.user?.userId ?? null;
  if (!title || !boardId) return res.status(400).json({ message: 'Title and boardId are required' });
  const task = await taskService.create({ title, description, status, priority, boardId, ownerId });
  return res.status(201).json(task);
}

export async function updateTask(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  const payload = req.body;
  const updated = await taskService.update(id, payload, req.user?.userId);
  if (!updated) return res.status(403).json({ message: 'Forbidden or task not found' });
  return res.json(updated);
}


export async function deleteTask(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  const removed = await taskService.remove(id, req.user?.userId);
  if (!removed) return res.status(403).json({ message: 'Forbidden or task not found' });
  return res.status(204).send();
}