import { Task, TaskPayload } from '../models/task';
import { v4 as uuidv4 } from 'uuid';

interface TaskFilters {
  status?: string;
  search?: string;
}

const tasks: Task[] = [];

export function findAll(filters?: TaskFilters): Task[] {
  let result = [...tasks];

    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if(filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
  
  return result
}

export function findById(id: string): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function create(payload: TaskPayload): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: String(payload.title),
    description: payload.description ? String(payload.description) : '',
    status: (payload.status ?? 'todo') as Task['status'],
    priority: (payload.priority ?? 'medium') as Task['priority'],
    createdAt: now,
    updatedAt: now
  };
  tasks.push(task);
  return task;
}

export function update(id: string, payload: Partial<TaskPayload>): Task | null {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  const current = tasks[index];
  if (!current) return null;
  const updated: Task = {
    ...current,
    title: payload.title !== undefined ? String(payload.title) : current.title,
    description: payload.description !== undefined ? String(payload.description) : current.description,
    status: payload.status ?? current.status,
    priority: payload.priority ?? current.priority,
    updatedAt: new Date().toISOString()
  };
  tasks[index] = updated;
  return updated;
}

export function remove(id: string): boolean {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
