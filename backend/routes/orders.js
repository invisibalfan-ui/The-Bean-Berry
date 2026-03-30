const router = require('express').Router()
const Order = require('../models/Order')
const MenuItem = require('../models/MenuItem')
const { sendPush } = require('../utils/push')

router.get('/', async (req,res) => {
  res.json(await Order.find().sort({ createdAt:-1 }))
})

router.post('/', async (req,res) => {

  const last = await Order.findOne().sort({ createdAt:-1 })
  const orderNumber = last ? last.orderNumber + 1 : 1

  for(const item of req.body.items) {
    await MenuItem.findByIdAndUpdate(item._id, {
      $inc: { stock: -1 }
    })
  }

  const order = await Order.create({
    items: req.body.items,
    total: req.body.total,
    pushToken: req.body.pushToken,
    orderNumber
  })

  req.app.get('io').emit('newOrder', order)

  res.json(order)
})

router.put('/:id', async (req,res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new:true })

  req.app.get('io').emit('updateOrder', order)

  if(order.status === 'ready') {
    await sendPush(order.pushToken, "Order Ready", `Order #${order.orderNumber} ready`)
  }

  res.json(order)
})

module.exports = router