require('dotenv').config();
const dns = require('dns');
// Override DNS to Google DNS to fix Node.js 'ECONNREFUSED' SRV lookup errors on certain Windows network configurations
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Security Headers ───
app.use(helmet());

// ─── CORS — restrict origins in production ───
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ─── Rate Limiting ───
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
});
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent abuse

// Load Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pandits', require('./routes/panditRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'API is running' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/poojaconnect';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
