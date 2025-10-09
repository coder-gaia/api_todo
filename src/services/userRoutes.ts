import { Router } from 'express';
import { registerAdmin, login } from '../controllers/userController';

const router = Router();

router.post('/register-admin', registerAdmin);
router.post('/login', login);

export default router;
