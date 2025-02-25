const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema({
  water: {
    type: Number,
  },
  gas: {
    type: Number,
  },
  day: {
    type: Number,
  },
  night: {
    type: Number,
  },
  period: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const MeterReading = mongoose.model('MeterReading', meterReadingSchema, 'meter_readings');

module.exports = MeterReading;