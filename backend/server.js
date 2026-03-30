require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

const server = http.createServer(app)
const io = new Server(server, { cors:{ origin:'*' } })

app.set('io', io)

io.on('connection', socket => {
  console.log('socket connected')
})

app.use('/api/menu', require('./routes/menu'))
app.use('/api/orders', require('./routes/orders'))

server.listen(process.env.PORT || 5000, () => console.log('Server running'))