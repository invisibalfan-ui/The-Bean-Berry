const router = require('express').Router()
const Settings = require('../models/Settings')

router.get('/', async (req, res) => {
  let s = await Settings.findOne()
  if (!s) s = await Settings.create({})
  res.json(s)
})

router.post('/', async (req, res) => {
  const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true })
  res.json(s)
})

module.exports = router