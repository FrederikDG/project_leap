import express from 'express';
import isAuth from '../middleware/isAuth.js';

const router = express.Router({ mergeParams: true });

// GET /api/companies/:companyId/campaigns
router.get('/', isAuth, async (req, res) => {
  const userId    = Number(req.userId);
  const companyId = Number(req.params.companyId);

  // verify ownership
  const company = await req.prisma.company.findUnique({
    where: { id: companyId, ownerId: userId },
  });
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const campaigns = await req.prisma.campaign.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(campaigns);
});

// POST /api/companies/:companyId/campaigns
router.post('/', isAuth, async (req, res) => {
  const userId    = Number(req.userId);
  const companyId = Number(req.params.companyId);
  const { title, link } = req.body;

  // verify ownership
  const company = await req.prisma.company.findUnique({
    where: { id: companyId, ownerId: userId },
  });
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const newCampaign = await req.prisma.campaign.create({
    data: {
      title,
      link,
      company: { connect: { id: companyId } },
    },
  });
  res.status(201).json(newCampaign);
});

export default router;
