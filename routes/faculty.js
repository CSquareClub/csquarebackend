const express = require('express');
const router = express.Router();
const FacultyMember = require('../models/FacultyMember');
const { authenticateAdmin } = require('../middleware/auth');
const Joi = require('joi');

// Validation schema for faculty members
const facultySchema = Joi.object({
  name: Joi.string().required().min(1).max(100).trim(),
  designation: Joi.string().required().min(1).max(150).trim(),
  department: Joi.string().required().min(1).max(100).trim(),
  bio: Joi.string().max(1000).optional().trim().allow(''),
  photo: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().allow('')
  ).optional(),
  email: Joi.string().email().optional().allow(''),
  linkedin: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().allow('')
  ).optional(),
  specialization: Joi.array().items(Joi.string().trim()).optional(),
  experience: Joi.string().max(100).optional().trim().allow(''),
  education: Joi.string().max(500).optional().trim().allow(''),
  isActive: Joi.boolean().optional(),
  displayOrder: Joi.number().min(0).optional()
});

const validateFaculty = (req, res, next) => {
  const { error } = facultySchema.validate(req.body);
  
  if (error) {
    console.log('Faculty validation error:', error.details);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// GET /api/faculty - Get all faculty members
router.get('/', async (req, res) => {
  try {
    const { active, department } = req.query;
    
    let query = {};
    if (active !== undefined) query.isActive = active === 'true';
    if (department) query.department = new RegExp(department, 'i');
    
    const facultyMembers = await FacultyMember.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: facultyMembers.length,
      data: facultyMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch faculty members',
      details: error.message
    });
  }
});

// GET /api/faculty/:id - Get single faculty member
router.get('/:id', async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findById(req.params.id);
    
    if (!facultyMember) {
      return res.status(404).json({
        success: false,
        error: 'Faculty member not found'
      });
    }
    
    res.json({
      success: true,
      data: facultyMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch faculty member',
      details: error.message
    });
  }
});

// POST /api/faculty - Add new faculty member (Admin only)
router.post('/', authenticateAdmin, validateFaculty, async (req, res) => {
  try {
    console.log('📝 Creating faculty member with data:', req.body);
    const facultyMember = new FacultyMember(req.body);
    await facultyMember.save();
    
    res.status(201).json({
      success: true,
      data: facultyMember,
      message: 'Faculty member added successfully'
    });
  } catch (error) {
    console.error('❌ Error creating faculty member:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to add faculty member',
      details: error.message
    });
  }
});

// PUT /api/faculty/:id - Update faculty member (Admin only)
router.put('/:id', authenticateAdmin, validateFaculty, async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!facultyMember) {
      return res.status(404).json({
        success: false,
        error: 'Faculty member not found'
      });
    }
    
    res.json({
      success: true,
      data: facultyMember,
      message: 'Faculty member updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update faculty member',
      details: error.message
    });
  }
});

// DELETE /api/faculty/:id - Delete faculty member (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findByIdAndDelete(req.params.id);
    
    if (!facultyMember) {
      return res.status(404).json({
        success: false,
        error: 'Faculty member not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete faculty member',
      details: error.message
    });
  }
});

module.exports = router;
