const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  optionId: {
    type: String,
    required: true
  },
  userName: String,
  votedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vote', voteSchema);