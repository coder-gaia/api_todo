import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function register({ username, email, password }: { username: string; email: string; password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
  return { id: user.id, username: user.username, email: user.email };
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role ?? null },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
}
