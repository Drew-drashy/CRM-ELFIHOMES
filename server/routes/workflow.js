const express = require('express');
const Workflow = require('../models/Workflow');
const router = express.Router();
const { evaluateConditions, executeActions } = require('../helpers/workflow');

// Get all workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.status(200).json(workflows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflows', details: err.message });
  }
});

// Get a specific workflow by ID
router.get('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow', details: err.message });
  }
});

// Create a new workflow
router.post('/', async (req, res) => {
  try {
    const { name, trigger, actions, conditions } = req.body;
    const workflow = new Workflow({ name, trigger, actions, conditions });
    await workflow.save();
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create workflow', details: err.message });
  }
});

// Update a workflow by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, trigger, actions, conditions } = req.body;
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      { name, trigger, actions, conditions },
      { new: true }
    );
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.status(200).json(workflow);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update workflow', details: err.message });
  }
});

// Delete a workflow by ID
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.status(200).json({ message: 'Workflow deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workflow', details: err.message });
  }
});

// Execute a workflow manually (optional)



router.post('/:id/execute', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    const { conditions, actions } = workflow;

    // Simulate data input (e.g., from a lead or event)
    const inputData = req.body;

    // Evaluate conditions
    if (evaluateConditions(conditions, inputData)) {
      await executeActions(actions, inputData);
      return res.status(200).json({ message: 'Workflow executed successfully' });
    } else {
      return res.status(400).json({ message: 'Conditions not met' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute workflow', details: err.message });
  }
});


module.exports = router;
