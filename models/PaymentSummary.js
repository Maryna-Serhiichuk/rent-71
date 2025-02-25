const mongoose = require('mongoose');

const paymentSummarySchema = new mongoose.Schema({
  water: {
    type: Number,
    required: true,
  },
  gas: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  night: {
    type: Number,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const PaymentSummary = mongoose.model('PaymentSummary', paymentSummarySchema, 'payment_summary');

module.exports = PaymentSummary;