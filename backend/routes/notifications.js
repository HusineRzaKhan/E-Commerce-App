const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// GET /api/notifications - user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 }).limit(50);
    res.json(notes);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
