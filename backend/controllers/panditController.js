const PanditProfile = require('../models/PanditProfile');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getPandits = async (req, res) => {
  try {
    const { city, poojaType } = req.query;
    let query = {};
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    if (poojaType) {
      query.specialization = new RegExp(poojaType, 'i');
    }

    const profiles = await PanditProfile.find(query).populate('user', 'name email mobile avatarUrl');
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPanditById = async (req, res) => {
  try {
    const profile = await PanditProfile.findById(req.params.id).populate('user', 'name email mobile avatarUrl');
    if (!profile) return res.status(404).json({ message: 'Pandit not found' });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMeProfile = async (req, res) => {
  try {
    const profile = await PanditProfile.findOne({ user: req.user.id }).populate('user', 'name email mobile avatarUrl');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

exports.updateMeProfile = async (req, res) => {
  try {
    const { city, address, experience, languages, specialization, charges, bio, name, mobile } = req.body;
    let profile = await PanditProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (city !== undefined) profile.city = city;
    if (address !== undefined) profile.address = address;
    if (experience !== undefined) profile.experience = experience;
    if (languages !== undefined) profile.languages = (typeof languages === 'string') ? languages.split(',').map(s => s.trim()) : languages;
    if (specialization !== undefined) profile.specialization = (typeof specialization === 'string') ? specialization.split(',').map(s => s.trim()) : specialization;
    if (charges !== undefined) profile.charges = charges;
    if (bio !== undefined) profile.bio = bio;

    await profile.save();

    if (name || mobile) {
      const userObj = await User.findById(req.user.id);
      if (name) userObj.name = name;
      if (mobile) userObj.mobile = mobile;
      await userObj.save();
    }

    const updatedProfile = await PanditProfile.findById(profile._id).populate('user', 'name email mobile avatarUrl');
    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// GET /api/pandits/:id/reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ pandit: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// POST /api/pandits/:id/reviews  (auth required, customer only)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const pandit = await PanditProfile.findById(req.params.id);
    if (!pandit) return res.status(404).json({ message: 'Pandit not found' });

    const customer = await User.findById(req.user.id);

    // Upsert: allow customer to update their own review
    const existing = await Review.findOne({ pandit: req.params.id, customer: req.user.id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.customerName = customer?.name;
      await existing.save();
    } else {
      await Review.create({
        pandit: req.params.id,
        customer: req.user.id,
        customerName: customer?.name,
        rating,
        comment,
      });
    }

    // Recalculate average rating on pandit profile
    const allReviews = await Review.find({ pandit: req.params.id });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    pandit.rating = Math.round(avg * 10) / 10;
    pandit.reviewsCount = allReviews.length;
    await pandit.save();

    res.status(201).json({
      message: 'Review submitted successfully!',
      rating: pandit.rating,
      reviewsCount: pandit.reviewsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
};
