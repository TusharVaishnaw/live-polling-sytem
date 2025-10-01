const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// Create poll
router.post('/', async (req, res) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get active poll
router.get('/active', async (req, res) => {
  try {
    const poll = await Poll.findOne({ isActive: true });
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get poll history
router.get('/history', async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: false }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get students participtaing
// Get participants of a poll
router.get('/:pollId/participants', async (req, res) => {
  try {
    const votes = await Vote.find({ pollId: req.params.pollId });
    
    const participants = votes.map(v => ({
      name: v.userName,
      voted: true
    }));

    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit vote
router.post('/vote', async (req, res) => {
  try {
    const { pollId, optionId, userName } = req.body;
    
    // Check if user already voted
    const existingVote = await Vote.findOne({ pollId, userName });
    if (existingVote) {
      return res.status(400).json({ error: 'Already voted' });
    }

    const vote = new Vote({ pollId, optionId, userName });
    await vote.save();

    // Update poll votes
    await Poll.updateOne(
      { _id: pollId, 'options._id': optionId },
      { $inc: { 'options.$.votes': 1 } }
    );

    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// End poll
router.patch('/:id/end', async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json(poll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
