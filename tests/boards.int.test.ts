import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Boards integration', () => {
  let ownerToken: string;
  let boardId: string;

  beforeAll(async () => {
  await prisma.$connect();
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.boardMember.deleteMany(),
    prisma.board.deleteMany(),
    prisma.user.deleteMany()
  ]);

    const ownerRes = await request(app)
      .post('/users/register-admin')
      .send({ username: 'board_owner', email: 'board_owner@test.com', password: '123456' });
    ownerToken = ownerRes.body.token;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a board', async () => {
    const res = await request(app)
      .post('/boards')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Test Board' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    boardId = res.body.id;
  });

  it('should fetch boards', async () => {
    const res = await request(app)
      .get('/boards')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
