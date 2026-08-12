import User from '../models/User.js';

// Get saved companies for the authenticated user
export const getCompanies = async (req, res, next) => {
  try {
    const user = req.user;
    const companies = (user && user.savedCompanyNames) ? user.savedCompanyNames : [];
    res.json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

// Add a company name to the user's saved list (dedupe, keep recent 50)
export const addCompany = async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmed = (name || '').trim();
    if (!trimmed) return res.status(400).json({ success: false, message: 'Company name required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existing = user.savedCompanyNames || [];
    const filtered = existing.filter(n => n.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 50);
    user.savedCompanyNames = updated;
    await user.save();

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
