import jwt from 'jsonwebtoken';
import { findUserById } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'omniconnect_super_secret_jwt_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No authentication token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired authentication token.' });
    }
    
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User account no longer exists.' });
    }

    // Strip passwordHash before attaching to request object
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin privileges required to access this resource.'
    });
  }

  next();
}
