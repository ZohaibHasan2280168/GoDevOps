const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payment/upgrade-to-premium
// @desc    Upgrade user to premium after successful payment
// @access  Private
router.post('/upgrade-to-premium', auth, [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('plan').notEmpty().withMessage('Plan is required'),
  body('amount').notEmpty().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { transactionId, paymentMethod, plan, amount } = req.body;
    const user = req.user;

    // Check if user is already premium
    if (user.isPremium) {
      return res.status(400).json({ 
        message: 'User is already a premium member' 
      });
    }

    // Update user to premium
    user.isPremium = true;
    
    // Add premium subscription details (you can expand this schema later)
    if (!user.premiumSubscription) {
      user.premiumSubscription = {};
    }
    
    user.premiumSubscription = {
      plan: plan,
      startDate: new Date(),
      transactionId: transactionId,
      paymentMethod: paymentMethod,
      amount: amount,
      status: 'active'
    };

    await user.save();

    res.json({
      message: 'Successfully upgraded to premium',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        level: user.level,
        points: user.points,
        completedLabs: user.completedLabs,
        premiumSubscription: user.premiumSubscription
      }
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ message: 'Server error during premium upgrade' });
  }
});

// @route   GET /api/payment/subscription-status
// @desc    Get user's subscription status
// @access  Private
router.get('/subscription-status', auth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      isPremium: user.isPremium,
      subscription: user.premiumSubscription || null
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payment/cancel-subscription
// @desc    Cancel premium subscription
// @access  Private
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user.isPremium) {
      return res.status(400).json({ 
        message: 'User does not have an active premium subscription' 
      });
    }

    // Downgrade user to free tier
    user.isPremium = false;
    
    if (user.premiumSubscription) {
      user.premiumSubscription.status = 'cancelled';
      user.premiumSubscription.cancelledAt = new Date();
    }

    await user.save();

    res.json({
      message: 'Premium subscription cancelled successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error during subscription cancellation' });
  }
});

module.exports = router;