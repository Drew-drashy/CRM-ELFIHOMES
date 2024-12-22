const express = require('express');
const Campaign = require('../models/Campaign');
const router = express.Router();

// Fetch all campaigns
router.get('/', async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

// Fetch a specific campaign
router.get('/:id', async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json(campaign);
});

// Create a new campaign
router.post('/', async (req, res) => {
  const { name, type, content, schedule } = req.body;
  const campaign = new Campaign({ name, type, content, schedule });
  await campaign.save();
  res.status(201).json(campaign);
});

// Delete a campaign
router.delete('/:id', async (req, res) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ message: 'Campaign deleted successfully' });
});

module.exports = router;
