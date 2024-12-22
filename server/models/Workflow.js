const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: {
    type: String, // e.g., 'lead_created', 'campaign_completed'
    required: true,
  },
  actions: [
    {
      type: String, // e.g., 'send_email', 'send_sms'
      required: true,
    },
  ],
  conditions: [
    {
      field: String, // e.g., 'lead.source'
      operator: String, // e.g., 'equals', 'contains'
      value: mongoose.Schema.Types.Mixed, // The value to check against
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workflow', workflowSchema);
