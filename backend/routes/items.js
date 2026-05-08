const express = require('express');
const authMiddleware = require('../middleware/auth');
const PackingSession = require('../models/PackingSession');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Helper: get or create session for user
async function getSession(userId) {
  let session = await PackingSession.findOne({ userId });
  if (!session) {
    session = await PackingSession.create({ userId, items: [], bagCapacity: 10 });
  }
  return session;
}

// GET /api/items – Get all items and bag capacity
router.get('/', async (req, res) => {
  try {
    const session = await getSession(req.user.id);
    res.json({
      items: session.items,
      bagCapacity: session.bagCapacity
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
});

// POST /api/items – Add a new item
router.post('/', async (req, res) => {
  try {
    const { name, weight, importance } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Item name is required.' });
    }
    if (!weight || weight <= 0) {
      return res.status(400).json({ message: 'Weight must be a positive number.' });
    }
    if (!importance || importance < 1 || importance > 10) {
      return res.status(400).json({ message: 'Importance must be between 1 and 10.' });
    }

    const session = await getSession(req.user.id);
    session.items.push({
      name: name.trim(),
      weight: parseFloat(weight),
      importance: parseInt(importance)
    });
    await session.save();

    res.status(201).json({
      message: 'Item added successfully!',
      items: session.items
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Failed to add item.' });
  }
});

// PUT /api/items/:id – Update an item
router.put('/:id', async (req, res) => {
  try {
    const { name, weight, importance } = req.body;
    const session = await getSession(req.user.id);

    const item = session.items.id(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    if (name) item.name = name.trim();
    if (weight) item.weight = parseFloat(weight);
    if (importance) item.importance = parseInt(importance);

    await session.save();

    res.json({
      message: 'Item updated successfully!',
      items: session.items
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Failed to update item.' });
  }
});

// DELETE /api/items/:id – Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const session = await getSession(req.user.id);

    const item = session.items.id(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    item.deleteOne();
    await session.save();

    res.json({
      message: 'Item deleted successfully!',
      items: session.items
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
});

// PUT /api/bag-capacity – Update bag capacity
router.put('/bag-capacity/update', async (req, res) => {
  try {
    const { capacity } = req.body;

    if (!capacity || capacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be a positive number.' });
    }

    const session = await getSession(req.user.id);
    session.bagCapacity = parseFloat(capacity);
    await session.save();

    res.json({
      message: 'Bag capacity updated!',
      bagCapacity: session.bagCapacity
    });
  } catch (error) {
    console.error('Update capacity error:', error);
    res.status(500).json({ message: 'Failed to update capacity.' });
  }
});

module.exports = router;
