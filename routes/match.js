const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Match mentors for a given mentee
router.get('/:menteeId', async (req, res) => {
  try {
    const mentee = await User.findById(req.params.menteeId);
    if (!mentee) return res.status(404).json({ message: 'Mentee not found' });

    if (mentee.role !== 'mentee') {
      return res.status(400).json({ message: 'Only mentees can request matches' });
    }

    // Find mentors that match mentee interests
    const mentors = await User.find({
      role: 'mentor',
      available: true,
      expertise: { $in: mentee.interests }
    }).select('-password');

    res.json({ matches: mentors });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
