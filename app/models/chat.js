const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  message_body: {
    type: String,
    required: true
  }
},
{
  timestamps: true 
});

module.exports = mongoose.model('Chat', ChatSchema);
