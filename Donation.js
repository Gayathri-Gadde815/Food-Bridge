// Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  expiry: { type: Date, required: true },
  contact: { type: String, required: true }
});

module.exports = mongoose.model('Donation', donationSchema);
