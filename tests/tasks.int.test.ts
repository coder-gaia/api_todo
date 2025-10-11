import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Tasks integration', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a task', async () => {
    const ownerRes = await request(app)
      .post('/users/register-admin')
      .send({ username: 'task_owner_create', email: 'create@test.com', password: '123456' });
    const ownerToken = ownerRes.body.token;

    const boardRes = await request(app)
      .post('/boards')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Board for create task' });
    const boardId = boardRes.body.id;

    // Cria a task
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
    expect(res.body.title).toBe('Test Task');
  });

  it('should update a task', async () => {
    const ownerRes = await request(app)
      .post('/users/register-admin')
      .send({ username: 'task_owner_update', email: 'update@test.com', password: '123456' });
    const ownerToken = ownerRes.body.token;

    const boardRes = await request(app)
      .post('/boards')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Board for update task' });
    const boardId = boardRes.body.id;

    const taskRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Original Task',
        description: 'Original description',
        priority: 'low',
        status: 'todo',
        boardId
      });
    const taskId = taskRes.body.id;

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
    const ownerRes = await request(app)
      .post('/users/register-admin')
      .send({ username: 'task_owner_delete', email: 'delete@test.com', password: '123456' });
    const ownerToken = ownerRes.body.token;

    const boardRes = await request(app)
      .post('/boards')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Board for delete task' });
    const boardId = boardRes.body.id;

    const taskRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Task to delete',
        description: 'Will be deleted',
        priority: 'medium',
        status: 'todo',
        boardId
      });
    const taskId = taskRes.body.id;

    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(204);

    const check = await prisma.task.findUnique({ where: { id: taskId } });
    expect(check).toBeNull();
  });
});
