import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import isAuth from './middleware/isAuth.js';
import cors from 'cors';
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  })
);

// mount auth routes under /auth
app.use('/auth', authRouter);

// protected endpoint
app.get('/api/secure-data', isAuth, (req, res) => {
  res.json({ secret: `Your user ID is ${req.userId}` });
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
