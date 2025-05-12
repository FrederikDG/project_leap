import jwt from 'jsonwebtoken';

export default function isAuth(req, res, next) {
  const auth = req.headers.authorization?.split(' ');
  if (!(auth && auth[0] === 'Bearer')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const payload = jwt.verify(auth[1], process.env.JWT_ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
