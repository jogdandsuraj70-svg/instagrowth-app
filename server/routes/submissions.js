import express from 'express';
import { createSubmission, getSubmissions } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/submissions - Create a new device submission record
router.post('/', authenticateToken, (req, res) => {
  try {
    const { platform, deviceType, browser, osName, osVersion, screenResolution, touchPoints, notes } = req.body;

    if (!platform || !deviceType || !browser) {
      return res.status(400).json({ success: false, error: 'Platform, deviceType, and browser are required.' });
    }

    const payload = {
      userId: req.user.id,
      email: req.user.email,
      platform,
      deviceType,
      browser,
      status: 'authenticated',
      osName: osName || 'Unknown',
      osVersion: osVersion || 'Unknown',
      screenResolution: screenResolution || 'Unknown',
      touchPoints: typeof touchPoints === 'number' ? touchPoints : 0,
      notes: notes || ''
    };

    const newSubmission = createSubmission(payload);

    return res.status(201).json({
      success: true,
      message: 'Submission created successfully.',
      submission: newSubmission
    });
  } catch (err) {
    console.error('Submission creation error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to record submission.' });
  }
});

// GET /api/submissions/mine - Fetch current user's submissions
router.get('/mine', authenticateToken, (req, res) => {
  try {
    const all = getSubmissions();
    const userSubmissions = all.filter(s => s.userId === req.user.id);
    return res.json({
      success: true,
      submissions: userSubmissions
    });
  } catch (err) {
    console.error('Fetch user submissions error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve user submissions.' });
  }
});

export default router;
