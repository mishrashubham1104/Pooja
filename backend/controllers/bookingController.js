const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { panditId, poojaType, date, timeSlot, address, specialInstructions, totalAmount } = req.body;

    const targetDate = new Date(date);
    
    // Prevent booking for past dates
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (targetDate < now) {
      return res.status(400).json({ message: 'You cannot book for a past date. Please select today or a future date.' });
    }

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existingBooking = await Booking.findOne({
      pandit: panditId,
      timeSlot: timeSlot,
      date: { $gte: targetDate, $lt: nextDate },
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is no longer available on this date.' });
    }

    const newBooking = new Booking({
      customer: req.user.id,
      pandit: panditId,
      poojaType,
      date,
      timeSlot,
      address,
      specialInstructions,
      totalAmount
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'pandit') {
      query.pandit = req.user.id;
    } else if (req.user.role === 'admin') {
      // admin sees all
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email mobile')
      .populate('pandit', 'name email mobile')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure authorization (simplistic check)
    if (req.user.role !== 'admin' && req.user.role !== 'pandit' && booking.customer.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

exports.getBookedSlots = async (req, res) => {
  try {
    const { panditId } = req.params;
    const { date } = req.query;
    
    if (!date) return res.json([]);

    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const bookings = await Booking.find({
       pandit: panditId,
       date: { $gte: targetDate, $lt: nextDate },
       status: { $ne: 'cancelled' }
    });

    const bookedSlots = bookings.map(b => b.timeSlot);
    res.json(bookedSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching slots' });
  }
};
