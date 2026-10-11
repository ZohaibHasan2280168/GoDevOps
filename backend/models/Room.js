const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Room title is required'],
    trim: true,
    maxlength: [100, 'Room title cannot exceed 100 characters']
  },
  short_description: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  long_description_markdown: {
    type: String,
    required: [true, 'Long description is required']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Development', 'Networking', 'Web', 'DevOps', 'Misc']
  },
  tags: [String],
  cover_image_url: String,
  creator: {
    type: String,
    default: 'CyberVerse Team'
  },
  estimated_time_minutes: {
    type: Number,
    required: true,
    min: [5, 'Estimated time must be at least 5 minutes']
  },
  prerequisites: [String],
  learning_objectives: [String],
  topics: [{
    id: Number,
    title: String,
    order: Number,
    estimated_time_minutes: Number,
    content_markdown: String
  }],
  quizzes: [{
    id: Number,
    title: String,
    order: Number,
    time_limit_seconds: Number,
    pass_percentage: Number,
    questions: [{
      id: Number,
      type: {
        type: String,
        enum: ['single', 'multi', 'short']
      },
      question_text: String,
      options: [String],
      correct_answer: mongoose.Schema.Types.Mixed,
      points: Number,
      explanation: String
    }]
  }],
  exercises: [{
    id: Number,
    title: String,
    order: Number,
    type: {
      type: String,
      enum: ['static', 'flag-based', 'docker-lab']
    },
    description_markdown: String,
    hint: String,
    expected_flag: String,
    auto_validate: Boolean,
    points: Number,
    admin_note: String
  }],
  additional_notes: String,
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
    score: Number,
    timeSpent: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better performance
roomSchema.index({ category: 1, difficulty: 1 });
roomSchema.index({ isActive: 1 });
roomSchema.index({ slug: 1 });
roomSchema.index({ tags: 1 });

module.exports = mongoose.model('Room', roomSchema);