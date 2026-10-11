const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/room-progress/:roomId - Get user's progress for a specific room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const user = await User.findById(req.user.id);
    
    const roomProgress = user.roomProgress.find(p => p.roomId === roomId) || {
      roomId,
      joined: false,
      currentLecture: 0,
      completedLectures: [],
      exerciseAnswers: {},
      quizCompleted: false,
      finalScore: null
    };

    res.json({ progress: roomProgress });
  } catch (error) {
    console.error('Get room progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/room-progress/:roomId/join - Join a room
router.post('/:roomId/join', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user.roomProgress) {
      user.roomProgress = [];
    }
    
    let roomProgress = user.roomProgress.find(p => p.roomId === roomId);
    
    if (!roomProgress) {
      user.roomProgress.push({
        roomId,
        joined: true,
        currentLecture: 0,
        completedLectures: [],
        exerciseAnswers: {},
        quizCompleted: false,
        finalScore: null,
        completed: false
      });
    } else {
      roomProgress.joined = true;
      // Ensure all required fields exist
      if (!roomProgress.completedLectures) roomProgress.completedLectures = [];
      if (!roomProgress.exerciseAnswers) roomProgress.exerciseAnswers = {};
      if (roomProgress.quizCompleted === undefined) roomProgress.quizCompleted = false;
      if (roomProgress.completed === undefined) roomProgress.completed = false;
    }
    
    await user.save();
    res.json({ message: 'Room joined successfully' });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/room-progress/:roomId/exercise - Submit exercise answer
router.post('/:roomId/exercise', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { lectureIndex, answer, isCorrect } = req.body;
    
    console.log('Exercise submission:', { roomId, lectureIndex, answer, isCorrect, userId: req.user.id });
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let roomProgress = user.roomProgress.find(p => p.roomId === roomId);
    
    if (!roomProgress) {
      return res.status(400).json({ message: 'Room not joined' });
    }
    
    // Initialize arrays if they don't exist
    if (!roomProgress.completedLectures) {
      roomProgress.completedLectures = [];
    }
    if (!roomProgress.exerciseAnswers) {
      roomProgress.exerciseAnswers = {};
    }
    
    // Update exercise answer
    roomProgress.exerciseAnswers[lectureIndex] = { answer, correct: isCorrect };
    
    // Mark lecture as completed
    if (!roomProgress.completedLectures.includes(lectureIndex)) {
      roomProgress.completedLectures.push(lectureIndex);
    }
    
    console.log('Updated room progress:', roomProgress);
    
    await user.save();
    
    // Trigger real-time update
    res.json({ 
      message: 'Exercise submitted successfully',
      userStats: {
        points: user.points,
        level: user.level,
        completedRooms: user.completedRooms,
        completedLabs: user.completedLabs
      }
    });
  } catch (error) {
    console.error('Submit exercise error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/room-progress/:roomId/quiz - Submit final quiz
router.post('/:roomId/quiz', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { score } = req.body;
    const user = await User.findById(req.user.id);
    
    let roomProgress = user.roomProgress.find(p => p.roomId === roomId);
    
    if (!roomProgress) {
      return res.status(400).json({ message: 'Room not joined' });
    }
    
    roomProgress.quizCompleted = true;
    roomProgress.finalScore = score;
    
    // Award points based on score
    const pointsEarned = Math.round((score / 100) * 500); // Max 500 points
    user.points += pointsEarned;
    
    // Update completed rooms count (only count unique rooms)
    if (!roomProgress.completed) {
      roomProgress.completed = true;
      roomProgress.completedAt = new Date();
      
      // Don't manually increment - let the pre-save hook handle it
      // The pre-save hook will calculate unique completed rooms
    }
    
    await user.save();
    res.json({ 
      message: 'Quiz completed successfully',
      pointsEarned,
      totalPoints: user.points,
      userStats: {
        points: user.points,
        level: user.level,
        completedRooms: user.completedRooms,
        completedLabs: user.completedLabs
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fix user completion counts (utility route)
router.post('/fix-counts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Recalculate correct counts
    const uniqueCompletedRooms = user.roomProgress ? user.roomProgress.filter(rp => rp.completed && rp.roomId).length : 0;
    const uniqueCompletedLabs = user.labProgress ? user.labProgress.filter(lp => lp.completed && lp.labId).length : 0;
    
    user.completedRooms = uniqueCompletedRooms;
    user.completedLabs = uniqueCompletedLabs;
    
    await user.save();
    
    res.json({
      message: 'Counts fixed successfully',
      completedRooms: user.completedRooms,
      completedLabs: user.completedLabs
    });
  } catch (error) {
    console.error('Fix counts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;