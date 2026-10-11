const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Update user progress after room/lab completion
router.post('/update', auth, async (req, res) => {
  try {
    const { type, itemId, points, timeSpent } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let isFirstCompletion = false;
    let pointsToAdd = 0;
    let leveledUp = false;

    if (type === 'room') {
      // Check if room already completed
      const existingProgress = user.roomProgress.find(p => p.roomId === itemId);
      
      if (existingProgress) {
        // Room replay - update score but no additional points for completion count
        const oldScore = existingProgress.score;
        existingProgress.score = points;
        existingProgress.completedAt = new Date();
        
        // Only add/subtract the difference in points
        pointsToAdd = points - oldScore;
      } else {
        // First completion
        isFirstCompletion = true;
        pointsToAdd = points;
        user.completedRooms += 1;
        user.roomProgress.push({
          roomId: itemId,
          completed: true,
          completedAt: new Date(),
          score: points
        });
      }
    } else if (type === 'lab') {
      // Check if lab already completed
      const existingProgress = user.labProgress.find(p => p.labId === itemId);
      
      if (existingProgress) {
        // Lab replay - update score but no additional points for completion count
        const oldScore = existingProgress.score;
        existingProgress.score = points;
        existingProgress.completedAt = new Date();
        
        // Only add/subtract the difference in points
        pointsToAdd = points - oldScore;
      } else {
        // First completion
        isFirstCompletion = true;
        pointsToAdd = points;
        user.completedLabs += 1;
        user.labProgress.push({
          labId: itemId,
          completed: true,
          completedAt: new Date(),
          score: points
        });
      }
    }

    // Update user points and level
    user.points += pointsToAdd;
    
    // Calculate new level (every 1000 points = 1 level)
    const newLevel = Math.floor(user.points / 1000) + 1;
    leveledUp = newLevel > user.level;
    user.level = newLevel;

    await user.save();

    // Calculate new rank
    const rank = await user.calculateRank();

    res.json({
      success: true,
      message: isFirstCompletion ? `${type} completed successfully!` : `${type} replayed successfully!`,
      data: {
        points: user.points,
        level: user.level,
        rank,
        leveledUp,
        completedLabs: user.completedLabs,
        completedRooms: user.completedRooms,
        isFirstCompletion,
        pointsAdded: pointsToAdd
      }
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get leaderboard (public endpoint)
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await User.find({ isActive: true })
      .select('name points level completedLabs completedRooms avatar')
      .sort({ points: -1, completedLabs: -1, completedRooms: -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json({
      success: true,
      data: leaderboardWithRank
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's current rank and stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('name points level completedLabs completedRooms');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const rank = await user.calculateRank();
    const totalUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        rank,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check if user has completed a specific room/lab
router.get('/check/:type/:itemId', auth, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let completed = false;
    let score = 0;
    let completedAt = null;

    if (type === 'room') {
      const progress = user.roomProgress.find(p => p.roomId === itemId);
      if (progress) {
        completed = progress.completed;
        score = progress.score;
        completedAt = progress.completedAt;
      }
    } else if (type === 'lab') {
      const progress = user.labProgress.find(p => p.labId === itemId);
      if (progress) {
        completed = progress.completed;
        score = progress.score;
        completedAt = progress.completedAt;
      }
    }

    res.json({
      success: true,
      data: {
        completed,
        score,
        completedAt
      }
    });
  } catch (error) {
    console.error('Check completion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;