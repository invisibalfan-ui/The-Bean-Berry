const mongoose = require('mongoose')

module.exports = mongoose.model('MenuItem', new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
}))