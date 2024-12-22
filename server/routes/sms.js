const express = require('express');
const { sendSMS } = require('../helpers/workflow');
const SMSLog = require('../models/SmsLog');
const router = express.Router();

// Send an SMS
router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  try {
    await sendSMS(phone, message);
    const log = new SMSLog({ phone, message, status: 'sent' });
    await log.save();
    res.status(200).json({ success: true, message: 'SMS sent successfully', log });
  } catch (err) {
    const log = new SMSLog({ phone, message, status: 'failed' });
    await log.save();
    res.status(500).json({ success: false, error: 'Failed to send SMS', log });
  }
});

// Fetch SMS logs
router.get('/logs', async (req, res) => {
  const logs = await SMSLog.find();
  res.json(logs);
});

module.exports = router;
