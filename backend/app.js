import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import quizzesRouter from './src/routes/quizzes.js';

const app = express();
dotenv.config();
app.use(cors({
    origin: process.env.CORS_ORINGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/quizzes', quizzesRouter);

export default app;