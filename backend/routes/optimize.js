const express = require('express');
const authMiddleware = require('../middleware/auth');
const PackingSession = require('../models/PackingSession');
const knapsack = require('../algorithms/knapsack');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/optimize – Run knapsack optimization
router.post('/', async (req, res) => {
  try {
    const session = await PackingSession.findOne({ userId: req.user.id });

    if (!session || session.items.length === 0) {
      return res.status(400).json({ message: 'No items to optimize. Please add items first.' });
    }

    if (!session.bagCapacity || session.bagCapacity <= 0) {
      return res.status(400).json({ message: 'Please set a valid bag capacity.' });
    }

    const startTime = Date.now();

    // Run the knapsack algorithm
    const result = knapsack(session.items, session.bagCapacity);

    const processingTime = Date.now() - startTime;

    res.json({
      message: 'Optimization complete!',
      result: {
        ...result,
        processingTime: `${processingTime}ms`
      }
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ message: 'Optimization failed. Please try again.' });
  }
});

module.exports = router;
