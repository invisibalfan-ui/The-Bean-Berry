const mongoose = require('mongoose')

module.exports = mongoose.model('User', {
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' }
})