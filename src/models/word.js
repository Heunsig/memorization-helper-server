const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    lowercase:true  
  },
  pos: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  clues: [{
    image: {
      type: String
    },
    text: {
      type: String
    }
  }]
}, {
  timestamps: true
})

module.exports = wordSchema