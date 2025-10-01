const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polling-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/polls', require('./routes/polls'));

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createPoll', (poll) => {
    io.emit('pollUpdate', poll);
  });

  socket.on('vote', (data) => {
    io.emit('voteUpdate', data);
  });

  socket.on('endPoll', (poll) => {
    io.emit('pollEnded', poll);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});