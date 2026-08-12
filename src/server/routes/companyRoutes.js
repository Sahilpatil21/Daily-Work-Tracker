import express from 'express';
import { getCompanies, addCompany } from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCompanies);
router.post('/', protect, addCompany);

export default router;
