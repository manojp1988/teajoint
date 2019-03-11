const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'products'
  },
  quantity: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('orders', orderSchema);
