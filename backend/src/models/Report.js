const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['accident', 'pothole', 'roadwork', 'flood', 'other'],
      default: 'accident',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'verified', 'resolved', 'rejected'],
      default: 'pending',
    },
    upvotes: {
      type: Number,
      default: 0,
    },

    // AI Fields (NEW)
    aiAnalysis: {
      analyzed: { type: Boolean, default: false },
      analyzedAt: { type: Date },
      accidentDetected: { type: Boolean },
      confidence: { type: Number, min: 0, max: 1 },
      predictedSeverity: {
        type: String,
        enum: ['low', 'medium', 'high'],
      },
      features: {
        red_ratio: Number,
        edge_density: Number,
        brightness: Number,
        contrast: Number,
        dark_ratio: Number,
        vehicle_count: Number,
      },
      indicators: [String],
      reasoning: [String],
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);