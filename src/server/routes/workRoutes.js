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
router.get('/date/:date', getWorkByDate);
router.get('/pdf/:date', downloadDailyPDF);

// General routes
router.route('/')
  .get(getAllWork)
  .post(createWork);

// ID-based routes with validation (must come last)
router.use('/:id', validateObjectId);
router.route('/:id')
  .put(updateWork)
  .delete(deleteWork);

export default router;
