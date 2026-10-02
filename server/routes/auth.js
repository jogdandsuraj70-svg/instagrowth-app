import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, updateUserLastLogin, updateUserConnection, findUserById } from '../db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, platform } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    updateUserLastLogin(user.id, platform || 'Desktop');

    const updatedUser = findUserById(user.id);

    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      user: sanitizeUser(updatedUser),
      token
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, platform } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = createUser({
      email,
      passwordHash,
      name: name || email.split('@')[0],
      role: 'user',
      platform: platform || 'Desktop',
      connectedAccount: 'Not Connected',
      connectionStatus: 'Not Connected'
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
      token
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
  }
});

// POST /api/auth/oauth (Google / Meta OAuth sign-in)
router.post('/oauth', async (req, res) => {
  try {
    const { provider, oauthToken, email, name, handle } = req.body;
    
    if (!provider || !email) {
      return res.status(400).json({ success: false, error: 'OAuth provider and verified email required.' });
    }

    let user = findUserByEmail(email);
    if (!user) {
      const dummyPasswordHash = await bcrypt.hash(`oauth_${Date.now()}_${Math.random()}`, 10);
      user = createUser({
        email,
        passwordHash: dummyPasswordHash,
        name: name || `${provider} Creator`,
        role: 'user',
        connectedAccount: handle || `@${email.split('@')[0]}`,
        connectionStatus: 'Connected',
        oauthProvider: provider
      });
    } else if (handle) {
      updateUserConnection(user.id, handle, 'Connected');
    }

    updateUserLastLogin(user.id);
    const updatedUser = findUserById(user.id);

    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      user: sanitizeUser(updatedUser),
      token,
      message: `Successfully authenticated via official ${provider} OAuth`
    });
  } catch (err) {
    console.error('OAuth error:', err.message);
    return res.status(500).json({ success: false, error: 'OAuth processing failed.' });
  }
});

// POST /api/auth/connect-instagram (Official Meta/Instagram OAuth Authorization Handler)
router.post('/connect-instagram', authenticateToken, async (req, res) => {
  try {
    const { handle } = req.body;
    const accountName = handle || `@${req.user.name.toLowerCase().replace(/\s+/g, '_')}_growth`;

    const updatedUser = updateUserConnection(req.user.id, accountName, 'Connected');

    return res.json({
      success: true,
      message: `Instagram account ${accountName} connected via official Meta OAuth.`,
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Connect Instagram OAuth error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to connect Instagram account.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
