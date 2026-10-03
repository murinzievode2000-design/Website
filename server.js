// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Serve the school's static frontend pages (login.html, dashboard.html, admin.html, etc.)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const photoRoutes = require('./routes/photoRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    httpOnly: true
  }
}));


app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);

// Fallback for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// Catches errors thrown by multer (e.g. file too large, wrong file type)
app.use((err, req, res, next) => {
  if (err && err.message) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ES Kabirizi server running at http://localhost:${PORT}`);
});
