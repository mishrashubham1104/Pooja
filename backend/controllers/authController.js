const User = require('../models/User');
const PanditProfile = require('../models/PanditProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, mobile, city, experience, specialization, languages, charges, bio } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      mobile
    });

    await user.save();

    if (user.role === 'pandit') {
      const profile = new PanditProfile({
        user: user._id,
        city,
        experience,
        specialization,
        languages,
        charges,
        bio
      });
      await profile.save();
    }

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate({
      path: 'favoritePandits',
      populate: { path: 'user', select: 'name avatarUrl' }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { panditId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.favoritePandits.indexOf(panditId);
    if (index > -1) {
      user.favoritePandits.splice(index, 1);
    } else {
      user.favoritePandits.push(panditId);
    }
    await user.save();

    // Return completely populated
    const updatedUser = await User.findById(req.user.id).select('-password').populate({
      path: 'favoritePandits',
      populate: { path: 'user', select: 'name avatarUrl' }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error toggling favorite' });
  }
};

// FORGOT PASSWORD — generates a 6-digit OTP-style token (15 min expiry)
exports.forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ message: 'Valid 10-digit Indian mobile number is required.' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      // Don't reveal whether mobile exists
      return res.json({ message: 'If that mobile number is registered, an OTP has been sent.' });
    }

    // Generate a random 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    res.json({
      message: 'If that mobile number is registered, an OTP has been sent.',
      // In production, send OTP via SMS gateway (e.g. Twilio, MSG91)
      // For development/testing only:
      ...(process.env.NODE_ENV !== 'production' && { resetToken: token }),
      expiresIn: '15 minutes'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD — verifies token and sets new password
exports.resetPassword = async (req, res) => {
  try {
    const { mobile, token, newPassword } = req.body;

    if (!mobile || !token || !newPassword) {
      return res.status(400).json({ message: 'Mobile, OTP token, and new password are required.' });
    }

    const user = await User.findOne({ mobile });
    if (!user || !user.resetPasswordToken) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
