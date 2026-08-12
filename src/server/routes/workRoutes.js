import express from 'express';
import { Types } from 'mongoose';
import {
  createWork,
  getAllWork,
  getWorkByDate,
  updateWork,
  deleteWork,
  downloadDailyPDF
} from '../controllers/workController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to validate ObjectId for :id routes
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid work entry ID'
    });
  }
  next();
};

// Specific routes first (must come before /:id)
router.get('/date/:date', protect, getWorkByDate);
router.get('/pdf/:date', protect, downloadDailyPDF);

// General routes
router.route('/')
  .get(protect, getAllWork)
  .post(protect, createWork);

// ID-based routes with validation and authorization (must come last)
router.use('/:id', validateObjectId);
router.route('/:id')
  .put(protect, updateWork)
  .delete(protect, deleteWork);

export default router;
