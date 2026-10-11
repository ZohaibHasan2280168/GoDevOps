const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lab title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lab description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  content: {
    type: String,
    required: [true, 'Lab content is required']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Security', 'Network Security', 'Cryptography', 'Forensics', 'Reverse Engineering', 'OSINT', 'Mobile Security', 'Cloud Security']
  },
  points: {
    type: Number,
    required: true,
    min: [10, 'Points must be at least 10'],
    max: [500, 'Points cannot exceed 500']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],
  tags: [String],
  estimatedTime: {
    type: Number, // in minutes
    required: true
  },
  prerequisites: [String],
  learningObjectives: [String],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'tool', 'documentation']
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
labSchema.index({ category: 1, difficulty: 1 });
labSchema.index({ isActive: 1, isPremium: 1 });

module.exports = mongoose.model('Lab', labSchema);