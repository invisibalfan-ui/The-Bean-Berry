const router = require('express').Router()
const QRCode = require('qrcode')

router.get('/', async (req, res) => {
  const url = "https://your-frontend.com/customer"
  const qr = await QRCode.toDataURL(url)
  res.json({ qr })
})

module.exports = router