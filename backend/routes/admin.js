const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Lab = require('../models/Lab');
const { cookieAuth } = require('../middleware/cookieAuth');
const router = express.Router();

// =============================================================================
// DASHBOARD & ANALYTICS
// =============================================================================

// Get admin dashboard stats
router.get('/dashboard/stats', cookieAuth, async (req, res) => {
  try {
    const [totalUsers, activeUsers, premiumUsers, totalRooms, totalLabs, newUsersToday] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isPremium: true }),
      Room.countDocuments({ isActive: true }),
      Lab.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    // Get user growth data for chart (last 7 days)
    const userGrowthData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      userGrowthData.push({
        date: date.toISOString().split('T')[0],
        users: count
      });
    }

    res.json({
      totalUsers,
      activeUsers,
      premiumUsers,
      totalRooms,
      totalLabs,
      newUsersToday,
      userGrowthData
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// =============================================================================
// USER MANAGEMENT
// =============================================================================

// Get all users with pagination and search
router.get('/users', cookieAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update user status/role
router.put('/users/:id', cookieAuth, async (req, res) => {
  try {
    const { isActive, isPremium, role } = req.body;
    const updates = {};
    
    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (typeof isPremium === 'boolean') updates.isPremium = isPremium;
    if (role && ['user', 'admin'].includes(role)) updates.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', cookieAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// =============================================================================
// ROOMS MANAGEMENT
// =============================================================================

// Get all rooms
router.get('/rooms', cookieAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const difficulty = req.query.difficulty || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const rooms = await Room.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(query);

    res.json({
      rooms,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

// Create new room
router.post('/rooms', cookieAuth, async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      createdBy: req.user.id
    };

    const room = new Room(roomData);
    await room.save();
    await room.populate('createdBy', 'name email');

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Create room error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Failed to create room' });
  }
});

// Update room
router.put('/rooms/:id', cookieAuth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    console.error('Update room error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Failed to update room' });
  }
});

// Delete room
router.delete('/rooms/:id', cookieAuth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Failed to delete room' });
  }
});

// =============================================================================
// LABS MANAGEMENT
// =============================================================================

// Get all labs
router.get('/labs', cookieAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const difficulty = req.query.difficulty || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const labs = await Lab.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lab.countDocuments(query);

    res.json({
      labs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get labs error:', error);
    res.status(500).json({ message: 'Failed to fetch labs' });
  }
});

// Create new lab
router.post('/labs', cookieAuth, async (req, res) => {
  try {
    const labData = {
      ...req.body,
      createdBy: req.user.id
    };

    const lab = new Lab(labData);
    await lab.save();
    await lab.populate('createdBy', 'name email');

    res.status(201).json({ message: 'Lab created successfully', lab });
  } catch (error) {
    console.error('Create lab error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Failed to create lab' });
  }
});

// Update lab
router.put('/labs/:id', cookieAuth, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.json({ message: 'Lab updated successfully', lab });
  } catch (error) {
    console.error('Update lab error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Failed to update lab' });
  }
});

// Delete lab
router.delete('/labs/:id', cookieAuth, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Delete lab error:', error);
    res.status(500).json({ message: 'Failed to delete lab' });
  }
});

module.exports = router;