const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/slots/:panditId', bookingController.getBookedSlots);
router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getMyBookings);
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router;
