const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/user');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { menteeId, mentorId, message } = req.body;
    const mentee = await User.findById(menteeId);
    const mentor = await User.findById(mentorId);

    if (!mentee || mentee.role !== 'mentee') {
      return res.status(400).json({ message: 'Invalid mentee' });
    }

    if (!mentor || mentor.role !== 'mentor') {
      return res.status(400).json({ message: 'Invalid mentor' });
    }

    const booking = new Booking({ mentee: menteeId, mentor: mentorId, message });
    await booking.save();

    res.status(201).json({ message: 'Connection request sent', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get bookings
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.menteeId) filter.mentee = req.query.menteeId;
    if (req.query.mentorId) filter.mentor = req.query.mentorId;

    const bookings = await Booking.find(filter)
      .populate('mentee', '-password')
      .populate('mentor', '-password');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ PUT route to approve/reject a booking
router.put('/:bookingId/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Only allow specific values
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    )
      .populate('mentee', '-password')
      .populate('mentor', '-password');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
