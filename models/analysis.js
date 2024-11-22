const mongoose = require('mongoose');

// Define Segment schema for each flight segment
const segmentSchema = new mongoose.Schema({
  Origin: {
    type: String,
    required: true,
  },
  Destination: {
    type: String,
    required: true,
  },
  DepartDate: {
    type: Date,
    required: true,
  },
});

// Define the main Trip schema with a reference to User
const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes your User model is named 'User'
    required: true,
  },
  TripType: {
    type: String,
    enum: ['one-way', 'round-trip', 'multi-city'],
    required: true,
  },
  Adult: {
    type: Number,
    required: true,
    min: 1,
  },
  Child: {
    type: Number,
    required: true,
    min: 0,
  },
  Infant: {
    type: Number,
    required: true,
    min: 0,
  },
  PreferredClass: {
    type: String,
    enum: ['Economy', 'Premium Economy', 'Business', 'First'],
    required: true,
  },
  Segments: {
    type: [segmentSchema],
    required: true,
    validate: [segments => segments.length > 0, 'At least one segment is required.'],
  },
  Currency: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const TripAnalysis = mongoose.model('Trip', tripSchema);



module.exports = { TripAnalysis }
