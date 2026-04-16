const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  pandit: { type: mongoose.Schema.Types.ObjectId, ref: 'PanditProfile', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });

// One review per customer per pandit
reviewSchema.index({ pandit: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
