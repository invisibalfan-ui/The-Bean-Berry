const router = require('express').Router()
const MenuItem = require('../models/MenuItem')

router.get('/', async (req,res) => {
  res.json(await MenuItem.find())
})

router.post('/', async (req,res) => {
  res.json(await MenuItem.create(req.body))
})

router.put('/:id', async (req,res) => {
  res.json(await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new:true }))
})

module.exports = router