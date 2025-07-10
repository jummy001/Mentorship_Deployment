const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['mentor', 'mentee', 'admin'], default: 'mentee' },

  // Profile fields
  bio:        { type: String },
  expertise:  { type: [String] },  // for mentors
  interests:  { type: [String] },  // for mentees
  available:  { type: Boolean, default: true },

  // New field: profile image
  avatar:     { type: String }     // URL or filename for profile image
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
