const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'pandit', 'admin'], default: 'customer' },
  mobile: { type: String },
  avatarUrl: { type: String },
  favoritePandits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PanditProfile' }],
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
