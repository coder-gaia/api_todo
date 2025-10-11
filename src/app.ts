import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import userRoutes from './services/userRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);
app.use('/boards', boardRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3333;

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

export default app;
