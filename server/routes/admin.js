import express from 'express';
import { readDB, getSubmissions, getCampaigns, deleteSubmission } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

// GET /api/admin/metrics - InstaGrowth Overview statistics
router.get('/metrics', (req, res) => {
  try {
    const db = readDB();
    const users = db.users || [];
    const campaigns = db.campaigns || [];
    const submissions = db.submissions || [];

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    const connectedAccounts = users.filter(u => u.connectionStatus === 'Connected').length;
    const totalCampaigns = campaigns.length;

    return res.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        connectedAccounts,
        totalCampaigns,
        recentActivity: submissions.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Admin metrics error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve admin metrics.' });
  }
});

// GET /api/admin/users - User table with connected account status
router.get('/users', (req, res) => {
  try {
    const db = readDB();
    let users = db.users || [];
    const { search, platform, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Sanitize passwords out
    let list = users.map(({ passwordHash, ...safe }) => safe);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.connectedAccount && u.connectedAccount.toLowerCase().includes(q))
      );
    }

    if (platform && platform !== 'all') {
      list = list.filter(u => (u.platform || 'Desktop').toLowerCase() === platform.toLowerCase());
    }

    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return res.json({
      success: true,
      users: list
    });
  } catch (err) {
    console.error('Admin users fetch error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch admin users.' });
  }
});

// GET /api/admin/submissions - Activity log table
router.get('/submissions', (req, res) => {
  try {
    let list = getSubmissions();
    const { search, platform, sortBy = 'submittedAt', order = 'desc', page = 1, limit = 10 } = req.query;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.userId && s.userId.toLowerCase().includes(q)) ||
        (s.connectedAccount && s.connectedAccount.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    if (platform && platform !== 'all') {
      list = list.filter(s => s.platform.toLowerCase() === platform.toLowerCase());
    }

    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;

    return res.json({
      success: true,
      submissions: list.slice(startIndex, startIndex + limitNum),
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (err) {
    console.error('Admin submissions fetch error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch admin submissions.' });
  }
});

// DELETE /api/admin/submissions/:id
router.delete('/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteSubmission(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Submission record not found.' });
    }
    return res.json({ success: true, message: `Record ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete record.' });
  }
});

export default router;
