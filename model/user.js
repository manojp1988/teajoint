const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String
  }
});

module.exports = mongoose.model('users', userSchema);
