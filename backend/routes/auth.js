const router = require('express').Router()
const jwt = require('jsonwebtoken')

const ADMIN_USER = "admin"
const ADMIN_PASS = "admin123"

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username !== ADMIN_USER || password !== ADMIN_PASS)
    return res.status(401).json({ error: "Invalid credentials" })

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.json({ token })
})

module.exports = router