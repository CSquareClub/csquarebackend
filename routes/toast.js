const express = require('express');
const router = express.Router();
const Toast = require('../models/Toast');
const { authenticateAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// GET /api/toast - Get all toasts
router.get('/', async (req, res) => {
  try {
    const toasts = await Toast.find().populate('eventId', 'title date');
    res.json({ success: true, data: toasts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch toasts', details: error.message });
  }
});

// POST /api/toast - Create new toast (Admin only)
// POST /api/toast/photo - Upload toast photo (Admin only)
router.post('/photo', authenticateAdmin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.error('Photo upload error: No file or file path found.', { file: req.file });
      return res.status(400).json({ success: false, error: 'No photo uploaded', debug: req.file });
    }
    console.log('Photo uploaded successfully:', req.file);
    res.json({ success: true, url: req.file.path, debug: req.file });
  } catch (error) {
    console.error('Photo upload failed:', error);
    res.status(500).json({ success: false, error: 'Failed to upload photo', details: error.message, stack: error.stack });
  }
});
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const toast = new Toast(req.body);
    await toast.save();
    res.status(201).json({ success: true, data: toast, message: 'Toast created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create toast', details: error.message });
  }
});

// PUT /api/toast/:id - Update toast (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const toast = await Toast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!toast) {
      return res.status(404).json({ success: false, error: 'Toast not found' });
    }
    res.json({ success: true, data: toast, message: 'Toast updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update toast', details: error.message });
  }
});

// DELETE /api/toast/:id - Delete toast (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const toast = await Toast.findByIdAndDelete(req.params.id);
    if (!toast) {
      return res.status(404).json({ success: false, error: 'Toast not found' });
    }
    res.json({ success: true, message: 'Toast deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete toast', details: error.message });
  }
});

module.exports = router;
