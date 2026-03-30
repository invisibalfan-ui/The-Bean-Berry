const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

// --- EXPRESS APP ---
const app = express()
app.use(cors())
app.use(express.json())

// --- MONGODB CONNECTION ---
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URI not defined in Railway variables")
  process.exit(1) // crash early if env is missing
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

// --- HTTP + SOCKET.IO ---
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.set('io', io)

io.on('connection', socket => {
  console.log('Socket connected:', socket.id)
})

// --- ROUTES ---
app.use('/api/menu', require('./routes/menu'))
app.use('/api/orders', require('./routes/orders'))

// --- START SERVER ---
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))