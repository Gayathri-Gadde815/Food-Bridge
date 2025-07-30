const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },        // ✅ Added
  district: { type: String, required: true },     // ✅ Added
  startYear: { type: String, required: true },    // ✅ Added
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Ngo', ngoSchema);
