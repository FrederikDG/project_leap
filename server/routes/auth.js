import express from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/hash.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await req.prisma.user.findUnique({ where: { username } });
  if (existing) return res.status(409).json({ error: 'Username taken' });

  const passwordHash = await hashPassword(password);
  const user = await req.prisma.user.create({
    data: { username, passwordHash },
  });
  res.status(201).json({ id: user.id, username: user.username });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await req.prisma.user.findUnique({ where: { username } });
  if (!user || !(await comparePasswords(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, ver: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  res.cookie('jid', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

// Refresh token
router.post('/refresh_token', async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ accessToken: '' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ accessToken: '' });
  }

  const user = await req.prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.tokenVersion !== payload.ver) {
    return res.status(401).json({ accessToken: '' });
  }

  const newAccessToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  res.json({ accessToken: newAccessToken });
});

export default router;
