const mongoose = require('mongoose')

module.exports = mongoose.model('Settings', {
  stripeEnabled: { type: Boolean, default: true }
})