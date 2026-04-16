const mongoose = require('mongoose');

const panditProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  city: { type: String, required: true },
  address: { type: String },
  experience: { type: Number, required: true }, // in years
  languages: [{ type: String }],
  specialization: [{ type: String }], // e.g. ["Satyanarayan Pooja", "Griha Pravesh"]
  charges: { type: Number },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PanditProfile', panditProfileSchema);
