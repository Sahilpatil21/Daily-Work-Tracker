import WorkEntry from '../models/WorkEntry.js';
import { generatePDF } from '../services/pdfService.js';

// @desc    Create new work entry
// @route   POST /api/work
export const createWork = async (req, res, next) => {
  try {
    const { companyName, toolName, description, quantity, rate, workDate, paid } = req.body;

    // Backend validation & calculation
    if (!companyName || !toolName || !description || quantity === undefined || rate === undefined || !workDate) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    if (quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be greater than 0');
    }

    if (rate < 0) {
      res.status(400);
      throw new Error('Rate must be greater than or equal to 0');
    }

    const amount = quantity * rate;

    const workEntry = await WorkEntry.create({
      user: req.user._id,
      companyName,
      toolName,
      description,
      quantity,
      rate,
      paid: Boolean(paid),
      amount,
      workDate
    });

    res.status(201).json({
      success: true,
      message: 'Work entry created successfully',
      data: workEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all work entries
// @route   GET /api/work
export const getAllWork = async (req, res, next) => {
  try {
    const works = await WorkEntry.find({ user: req.user._id }).sort({ workDate: -1, createdAt: -1 });
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get work entries by date
// @route   GET /api/work/date/:date
export const getWorkByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const works = await WorkEntry.find({ user: req.user._id, workDate: date }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: works
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update work entry
// @route   PUT /api/work/:id
export const updateWork = async (req, res, next) => {
  try {
    const { companyName, toolName, description, quantity, rate, workDate, paid } = req.body;
    
    const workEntry = await WorkEntry.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!workEntry) {
      res.status(404);
      throw new Error('Work entry not found');
    }

    if (quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be greater than 0');
    }

    if (rate < 0) {
      res.status(400);
      throw new Error('Rate must be greater than or equal to 0');
    }

    workEntry.companyName = companyName || workEntry.companyName;
    workEntry.toolName = toolName || workEntry.toolName;
    workEntry.description = description || workEntry.description;
    workEntry.quantity = quantity !== undefined ? quantity : workEntry.quantity;
    workEntry.rate = rate !== undefined ? rate : workEntry.rate;
    workEntry.workDate = workDate || workEntry.workDate;
    workEntry.paid = paid !== undefined ? Boolean(paid) : workEntry.paid;
    
    // Recalculate amount
    workEntry.amount = workEntry.quantity * workEntry.rate;

    const updatedWork = await workEntry.save();

    res.json({
      success: true,
      message: 'Work entry updated successfully',
      data: updatedWork
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete work entry
// @route   DELETE /api/work/:id
export const deleteWork = async (req, res, next) => {
  try {
    const workEntry = await WorkEntry.findOne({ _id: req.params.id, user: req.user._id });
    if (!workEntry) {
      res.status(404);
      throw new Error('Work entry not found');
    }

    await workEntry.deleteOne();

    res.json({
      success: true,
      message: 'Work entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Daily PDF
// @route   GET /api/work/pdf/:date
export const downloadDailyPDF = async (req, res, next) => {
  try {
    const { date } = req.params;
    const generatorCompany = req.query.company || 'Daily Work Report';
    
    const works = await WorkEntry.find({ user: req.user._id, workDate: date }).sort({ createdAt: -1 });

    if (!works || works.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No work records found for the selected date.'
      });
    }

    const totalEntries = works.length;
    const totalQuantity = works.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = works.reduce((sum, item) => sum + item.amount, 0);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Daily_Work_Report_${date}.pdf`);

    // Generate PDF and pipe to response
    generatePDF(res, {
      date,
      generatorCompany,
      works,
      totalEntries,
      totalQuantity,
      totalAmount
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get tool name suggestions by company
// @route   GET /api/work/suggestions/tools
export const getToolNamesSuggestions = async (req, res, next) => {
  try {
    const { company } = req.query;
    
    if (!company) {
      return res.json({
        success: true,
        data: []
      });
    }

    const toolNames = await WorkEntry.distinct('toolName', {
      user: req.user._id,
      companyName: company
    });

    res.json({
      success: true,
      data: toolNames
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get description suggestions by company
// @route   GET /api/work/suggestions/descriptions
export const getDescriptionsSuggestions = async (req, res, next) => {
  try {
    const { company } = req.query;
    
    if (!company) {
      return res.json({
        success: true,
        data: []
      });
    }

    const descriptions = await WorkEntry.distinct('description', {
      user: req.user._id,
      companyName: company
    });

    res.json({
      success: true,
      data: descriptions
    });
  } catch (error) {
    next(error);
  }
};
