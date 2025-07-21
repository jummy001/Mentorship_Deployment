const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // ✅ Required for hashing
require('dotenv').config();

const User = require('./models/user'); // ✅ Import your User model

const app = express();
const PORT = 5000;
const DB = process.env.MONGO_URI;

console.log('🔐 DB URI:', DB);

// ✅ Ensure /uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve static files from /uploads
app.use('/uploads', express.static(uploadPath));

// ✅ Route imports
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/userRoutes');

// ✅ Use routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/match', matchRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running 🎉');
});

// ✅ Connect to MongoDB
if (!DB) {
  console.error('❌ Missing MONGO_URI in .env file!');
  process.exit(1);
}

mongoose.connect(DB)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // ✅ Create default admin if not present
    User.findOne({ role: 'admin' }).then(admin => {
      if (!admin) {
        const hashed = bcrypt.hashSync('admin123', 10);
        User.create({
          fullName: 'Admin',
          email: 'admin@example.com',
          password: hashed,
          role: 'admin'
        }).then(() => {
          console.log('🛡️ Default admin created (admin@example.com / admin123)');
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed');
    console.error(err);
  });
