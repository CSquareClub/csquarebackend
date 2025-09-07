const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { authenticateAdmin } = require('../middleware/auth');

// POST /api/upload - Handle image upload to Cloudinary
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Return the Cloudinary URL
    res.json({
      success: true,
      data: {
        url: req.file.path,
        public_id: req.file.filename,
        secure_url: req.file.path
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// POST /api/upload/validate-url - Validate external image URLs
router.post('/validate-url', authenticateAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    // Additional validation for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    const isImageUrl = imageExtensions.test(url) || 
                      url.includes('cloudinary.com') ||
                      url.includes('imgur.com') ||
                      url.includes('unsplash.com') ||
                      url.includes('githubusercontent.com') ||
                      url.includes('linkedin.com') ||
                      url.includes('twitter.com') ||
                      url.includes('instagram.com') ||
                      url.includes('facebook.com') ||
                      url.startsWith('data:image/');

    if (!isImageUrl) {
      console.warn('URL might not be an image:', url);
      // Don't reject, just warn - let the frontend handle it
    }

    res.json({
      success: true,
      data: {
        url: url,
        valid: true
      },
      message: 'URL validated successfully'
    });
  } catch (error) {
    console.error('URL validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate URL',
      details: error.message
    });
  }
});

module.exports = router;
