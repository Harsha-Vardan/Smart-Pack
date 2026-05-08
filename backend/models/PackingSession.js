const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  weight: {
    type: Number,
    required: [true, 'Item weight is required'],
    min: [0.1, 'Weight must be at least 0.1 kg']
  },
  importance: {
    type: Number,
    required: [true, 'Importance score is required'],
    min: [1, 'Importance must be at least 1'],
    max: [10, 'Importance cannot exceed 10']
  }
});

const packingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bagCapacity: {
    type: Number,
    default: 10,
    min: [1, 'Bag capacity must be at least 1 kg']
  },
  items: [itemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
packingSessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PackingSession', packingSessionSchema);
