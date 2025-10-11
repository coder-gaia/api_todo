import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Tasks integration', () => {
  let ownerToken: string;
  let boardId: string;
  let taskId: string;

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();

    const ownerRes = await request(app)
      .post('/users/register-admin')
      .send({ username: 'task_owner', email: 'task_owner@test.com', password: '123456' });
    ownerToken = ownerRes.body.token;

    const boardRes = await request(app)
      .post('/boards')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Task Board' });
    boardId = boardRes.body.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Test Task',
        description: 'My task description',
        priority: 'medium',
        status: 'todo',
        boardId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    taskId = res.body.id; 
  });

  it('should update a task', async () => {
    if (!taskId) throw new Error('Task ID not set from previous test');

    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Updated Task',
        description: 'New Desc',
        priority: 'high',
        status: 'done',
        boardId
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.priority).toBe('high');
    expect(res.body.status).toBe('done');
  });

  it('should delete a task', async () => {
    if (!taskId) throw new Error('Task ID not set from previous test');

    const check = await prisma.task.findUnique({ where: { id: taskId } });
    expect(check).not.toBeNull();

    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(204);

    const deleted = await prisma.task.findUnique({ where: { id: taskId } });
    expect(deleted).toBeNull();
  });
});
