import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  try {
    const user = await authService.register({ username, email, password });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const token = await authService.login({ email, password });
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}