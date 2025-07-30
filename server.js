
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

const connectDB = require('./db');
const Donation = require('./Donation');
const Ngo = require('./Ngo');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(__dirname));

// POST route to handle donation submission
app.post('/api/donate', async (req, res) => {
  const { name, quantity, state, district, expiry, contact } = req.body;

  if (!name || !quantity || !state || !district || !expiry || !contact) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newDonation = new Donation({
      name,
      quantity,
      state,
      district,
      expiry,
      contact
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation saved successfully." });
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).json({ message: "Failed to save donation." });
  }
});

// NGO Registration
app.post('/api/ngo/register', async (req, res) => {
  const { name, location, contact, email, password, state, district, startYear } = req.body;

  if (!name || !location || !contact || !email || !password || !state || !district || !startYear) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newNgo = new Ngo({
      name,
      location,
      contact,
      email,
      password: hashedPassword,
      state,
      district,
      startYear
    });

    await newNgo.save();
    res.status(201).json({ message: "NGO registered successfully." });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ message: "Server error during registration." });
  }
});


// Middleware to verify developer token (simple for demo, replace with better auth in prod)
function verifyDevToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token === `Bearer ${process.env.DEV_ACCESS_TOKEN}`) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}

// NGO Login
app.post('/api/ngo/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const ngo = await Ngo.findOne({ email });
    if (!ngo) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, ngo.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const payload = {
      ngoId: ngo._id,
      ngoName: ngo.name,
      email: ngo.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: "Login successful.",
      token,
      ngoId: ngo._id,
      ngoName: ngo.name
    });
  } catch (error) {
    console.error('NGO login error:', error);
    res.status(500).json({ message: "Server error during login." });
  }
});

//donations
app.get('/api/donations', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ expiry: 1 });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});


//NGO Profile
app.get('/api/ngo/profile', authenticateToken, async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.user.ngoId).select('-password');
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found." });
    }
    res.json(ngo);
  } catch (err) {
    console.error('Error fetching NGO profile:', err);
    res.status(500).json({ message: "Server error." });
  }
});



// GET all registered NGOs from MongoDB
app.get('/api/ngos', async (req, res) => {
  try {
    const ngos = await Ngo.find();
    res.json(ngos);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ message: 'Failed to load NGOs' });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
