const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const User = require('../models/user');

// ✅ Upload avatar route
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { userId } = req.body;
    const avatarPath = req.file.filename;

    if (!userId || !avatarPath) {
      return res.status(400).json({ message: 'Missing userId or avatar file' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: `http://localhost:5000/uploads/${avatarPath}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
