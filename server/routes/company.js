import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { upload } from '../utils/upload.js';   // ← add this import

const router = express.Router();

// GET /api/companies
router.get('/', isAuth, async (req, res) => {
  const userId = Number(req.userId);
  const companies = await req.prisma.company.findMany({
    where: { ownerId: userId },
    include: { campaigns: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(companies);
});

// POST /api/companies
router.post(
  '/',
  isAuth,
  upload.single('profilePic'),             // now upload is defined
  async (req, res) => {
    try {
      const userId = Number(req.userId);
      const { name, color } = req.body;
      const profilePic = req.file ? req.file.filename : null;

      const newCompany = await req.prisma.company.create({
        data: { name, color, profilePic, ownerId: userId },
      });
      res.status(201).json(newCompany);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create company' });
    }
  }
);

export default router;
