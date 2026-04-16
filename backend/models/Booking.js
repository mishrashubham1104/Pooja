const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pandit: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  poojaType: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  specialInstructions: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
