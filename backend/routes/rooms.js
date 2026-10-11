const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Test database connection
router.get('/test/connection', async (req, res) => {
  try {
    const count = await Room.countDocuments();
    const rooms = await Room.find({}).select('slug title').limit(5);
    res.json({ 
      message: 'Database connected', 
      roomCount: count,
      sampleRooms: rooms
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message 
    });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, tags } = req.query;
    let filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    const rooms = await Room.find(filter)
      .select('-exercises.expected_flag -quizzes.questions.correct_answer')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get room by slug
router.get('/:slug', async (req, res) => {
  console.log('🔍 Received request for slug:', req.params.slug);
  
  try {
    const { slug } = req.params;
    
    const room = await Room.findOne({ slug: slug, isActive: true })
      .select('-exercises.expected_flag -quizzes.questions.correct_answer');
    
    console.log('📦 Room found:', !!room);
    
    if (!room) {
      console.log('❌ Room not found for slug:', req.params.slug);
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Ensure all nested arrays exist
    const roomData = {
      ...room.toObject(),
      topics: room.topics || [],
      exercises: room.exercises || [],
      quizzes: room.quizzes || [],
      prerequisites: room.prerequisites || [],
      learning_objectives: room.learning_objectives || [],
      tags: room.tags || []
    };

    console.log('✅ Sending room data with topics:', roomData.topics?.length || 0);
    res.json({
      success: true,
      data: roomData
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new room (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      createdBy: req.user.id
    };

    const room = new Room(roomData);
    await room.save();

    res.status(201).json({
      success: true,
      data: room,
      message: 'Room created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Room slug already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
});

// Submit exercise answer
router.post('/:slug/exercises/:exerciseId/submit', auth, async (req, res) => {
  try {
    const { answer } = req.body;
    const room = await Room.findOne({ slug: req.params.slug });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const exercise = room.exercises.find(ex => ex.id === parseInt(req.params.exerciseId));
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Simple validation (in production, use proper hashing)
    const isCorrect = answer.trim().toLowerCase() === exercise.expected_flag.toLowerCase();

    if (isCorrect) {
      // Update user progress
      const user = await User.findById(req.user.id);
      if (user) {
        user.points = (user.points || 0) + exercise.points;
        await user.save();
      }
    }

    res.json({
      success: true,
      correct: isCorrect,
      points: isCorrect ? exercise.points : 0,
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Submit quiz answers
router.post('/:slug/quizzes/:quizId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const room = await Room.findOne({ slug: req.params.slug });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const quiz = room.quizzes.find(q => q.id === parseInt(req.params.quizId));
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const results = [];

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === 'single') {
        isCorrect = userAnswer === question.correct_answer;
      } else if (question.type === 'multi') {
        isCorrect = Array.isArray(userAnswer) && 
          userAnswer.length === question.correct_answer.length &&
          userAnswer.every(ans => question.correct_answer.includes(ans));
      } else if (question.type === 'short') {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
      }

      if (isCorrect) {
        earnedPoints += question.points;
      }

      results.push({
        questionId: question.id,
        correct: isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation
      });
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= quiz.pass_percentage;

    if (passed) {
      // Update user progress
      const user = await User.findById(req.user.id);
      if (user) {
        user.points = (user.points || 0) + earnedPoints;
        await user.save();
      }
    }

    res.json({
      success: true,
      passed,
      percentage: Math.round(percentage),
      earnedPoints,
      totalPoints,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Complete room
router.post('/:slug/complete', auth, async (req, res) => {
  try {
    const { timeSpent, finalScore } = req.body;
    const room = await Room.findOne({ slug: req.params.slug });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user already completed this room
    const existingCompletionIndex = room.completedBy.findIndex(
      completion => completion.userId.toString() === req.user.id
    );

    let isReplay = false;
    
    if (existingCompletionIndex !== -1) {
      // Update existing completion (replay)
      isReplay = true;
      room.completedBy[existingCompletionIndex] = {
        userId: req.user.id,
        score: finalScore || 0,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      };
    } else {
      // Add new completion record
      room.completedBy.push({
        userId: req.user.id,
        score: finalScore || 0,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      });
    }
    
    await room.save();

    res.json({
      success: true,
      message: isReplay ? 'Room replayed successfully!' : 'Room completed successfully!',
      data: {
        completedAt: new Date(),
        score: finalScore || 0,
        timeSpent: timeSpent || 0,
        isReplay
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;