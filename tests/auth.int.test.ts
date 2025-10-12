import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

describe('Auth integration', () => {
beforeAll(async () => {
  await prisma.$connect();
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.boardMember.deleteMany(),
    prisma.board.deleteMany(),
    prisma.user.deleteMany()
  ]);
});

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should register an owner and return token', async () => {
    const res = await request(app)
      .post('/users/register-admin')
      .send({ username: 'test_owner', email: 'owner@test.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', 'test_owner');
  });

  it('should login owner and return token and user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'owner@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    const token = res.body.token as string;
    const payload = jwt.verify(token, JWT_SECRET) as any;
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('username');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'owner@test.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });
});
