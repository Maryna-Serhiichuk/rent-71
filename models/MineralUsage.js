const mongoose = require('mongoose');

const mineralUsageSchema = new mongoose.Schema({
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

const MineralUsage = mongoose.model('MineralUsage', mineralUsageSchema, 'mineral_usage');

module.exports = MineralUsage;