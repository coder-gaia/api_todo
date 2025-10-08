import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

export async function listTasks(_req: Request, res: Response) {
  const {status, search} = _req.query;
  const tasks = taskService.findAll({status: status as string, search: search as string});
  return res.json(tasks);
}

export async function getTask(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const task = taskService.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
}

export async function createTask(req: Request, res: Response) {
  const payload = req.body;
  if (!payload || !payload.title) {
    return res.status(400).json({ message: 'Invalid payload: title is required' });
  }
  const task = taskService.create(payload);
  return res.status(201).json(task);
}

export async function updateTask(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const payload = req.body;
  const updated = taskService.update(id, payload);
  if (!updated) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(updated);
}

export async function deleteTask(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const removed = taskService.remove(id);
  if (!removed) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.status(204).send();
}
