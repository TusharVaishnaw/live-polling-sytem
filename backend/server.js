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
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polling-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/polls', require('./routes/polls'));

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createPoll', (poll) => {
    io.emit('pollUpdate', poll);
  });

  socket.on('vote', async (data) => {
    io.emit('voteUpdate', data);
    
    // Fetch and emit updated participants
    try {
      const Vote = require('./models/Vote');
      const votes = await Vote.find({ pollId: data.pollId });
      const participants = votes.map(v => ({
        name: v.userName,
        voted: true
      }));
      io.emit('participantsUpdate', participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  });

  socket.on('endPoll', (poll) => {
    io.emit('pollEnded', poll);
  });

  socket.on('userJoined', (user) => {
    socket.emit('participantJoined', user);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
