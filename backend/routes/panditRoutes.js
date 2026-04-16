const express = require('express');
const router = express.Router();
const panditController = require('../controllers/panditController');
const auth = require('../middleware/auth');

router.get('/me', auth, panditController.getMeProfile);
router.put('/me', auth, panditController.updateMeProfile);
router.get('/', panditController.getPandits);
router.get('/:id', panditController.getPanditById);
router.get('/:id/reviews', panditController.getReviews);
router.post('/:id/reviews', auth, panditController.addReview);

module.exports = router;
