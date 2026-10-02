import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Initial default InstaGrowth seed state
const initialData = {
  users: [
    {
      id: 'usr_admin_001',
      email: 'admin@instagrowth.com',
      // Password: AdminPass123!
      passwordHash: '$2a$10$w6B9rN6N8a2eB5/QpYg4O.ZqZ/hV1DqQ8B1m.0GvWnO/y1cK1dJ.G', 
      name: 'InstaGrowth Administrator',
      role: 'admin',
      platform: 'Desktop',
      connectedAccount: '@admin_official',
      connectionStatus: 'Connected',
      createdAt: '2026-01-01T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_normal_002',
      email: 'user@example.com',
      // Password: Password123!
      passwordHash: '$2a$10$e9S8iY1E4a7qW2zO5vL7NuXG2sK4M6P8Q0R2S4T6U8V0W2X4Y6Z8',
      name: 'Alex Rivera',
      role: 'user',
      platform: 'iOS',
      connectedAccount: '@alex_growth',
      connectionStatus: 'Connected',
      createdAt: '2026-01-15T10:30:00.000Z',
      lastLogin: new Date().toISOString()
    }
  ],
  campaigns: [
    {
      id: 'cmp_001',
      userId: 'usr_normal_002',
      title: 'Summer Engagement Boost',
      type: 'Followers & Engagement Growth',
      status: 'Active',
      targetAudience: 'Fashion & Lifestyle',
      dailyBudget: '$15/day',
      followersGained: +1420,
      engagementRate: '6.8%',
      createdAt: '2026-09-20T10:00:00.000Z'
    },
    {
      id: 'cmp_002',
      userId: 'usr_normal_002',
      title: 'Reels Content Optimization',
      type: 'Post Analytics & Reach',
      status: 'Active',
      targetAudience: 'Tech & AI Enthusiasts',
      dailyBudget: '$25/day',
      followersGained: +2890,
      engagementRate: '8.4%',
      createdAt: '2026-09-25T14:30:00.000Z'
    },
    {
      id: 'cmp_003',
      userId: 'usr_admin_001',
      title: 'Global Growth Scaling',
      type: 'Brand Awareness',
      status: 'Active',
      targetAudience: 'Global Creators',
      dailyBudget: '$50/day',
      followersGained: +5400,
      engagementRate: '9.2%',
      createdAt: '2026-09-28T09:15:00.000Z'
    }
  ],
  submissions: [
    {
      id: 'sub_ios_001',
      userId: 'usr_normal_002',
      email: 'user@example.com',
      platform: 'iOS',
      deviceType: 'iPhone 15 Pro',
      browser: 'Safari',
      connectedAccount: '@alex_growth',
      connectionStatus: 'Connected',
      submittedAt: '2026-10-02T10:15:00.000Z',
      status: 'authenticated',
      notes: 'Initial growth campaign launch from iPhone Safari'
    },
    {
      id: 'sub_android_002',
      userId: 'usr_normal_002',
      email: 'user@example.com',
      platform: 'Android',
      deviceType: 'Samsung Galaxy S24',
      browser: 'Chrome',
      connectedAccount: '@alex_growth',
      connectionStatus: 'Connected',
      submittedAt: '2026-10-02T11:45:00.000Z',
      status: 'authenticated',
      notes: 'Analytics check from Galaxy S24 Mobile Chrome'
    }
  ]
};

async function ensureSeedHashes() {
  const adminHash = await bcrypt.hash('AdminPass123!', 10);
  const userHash = await bcrypt.hash('Password123!', 10);
  initialData.users[0].passwordHash = adminHash;
  initialData.users[1].passwordHash = userHash;
}

export function initDB() {
  if (!fs.existsSync(DATA_FILE)) {
    ensureSeedHashes().then(() => {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log('InstaGrowth Database initialized with default seed data.');
    });
  }
}

export function readDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      initDB();
      return initialData;
    }
    const dataStr = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(dataStr);
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// User Helpers
export function findUserByEmail(email) {
  const db = readDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  const db = readDB();
  return db.users.find(u => u.id === id);
}

export function createUser(userData) {
  const db = readDB();
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    ...userData,
    connectedAccount: userData.connectedAccount || 'Not Connected',
    connectionStatus: userData.connectionStatus || 'Not Connected',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

export function updateUserConnection(id, accountName, status) {
  const db = readDB();
  const user = db.users.find(u => u.id === id);
  if (user) {
    user.connectedAccount = accountName;
    user.connectionStatus = status;
    writeDB(db);
  }
  return user;
}

export function updateUserLastLogin(id, platform = 'Desktop') {
  const db = readDB();
  const user = db.users.find(u => u.id === id);
  if (user) {
    user.lastLogin = new Date().toISOString();
    user.platform = platform;
    writeDB(db);
  }
}

// Campaigns Helpers
export function getCampaigns() {
  const db = readDB();
  return db.campaigns || [];
}

export function createCampaign(payload) {
  const db = readDB();
  const newCampaign = {
    id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    ...payload,
    createdAt: new Date().toISOString()
  };
  if (!db.campaigns) db.campaigns = [];
  db.campaigns.unshift(newCampaign);
  writeDB(db);
  return newCampaign;
}

// Submissions / Activity Logs Helpers
export function getSubmissions() {
  const db = readDB();
  return db.submissions || [];
}

export function createSubmission(payload) {
  const db = readDB();
  const newSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    ...payload,
    submittedAt: payload.submittedAt || new Date().toISOString()
  };
  if (!db.submissions) db.submissions = [];
  db.submissions.unshift(newSubmission);
  writeDB(db);
  return newSubmission;
}

export function deleteSubmission(id) {
  const db = readDB();
  const initialLen = db.submissions.length;
  db.submissions = db.submissions.filter(s => s.id !== id);
  if (db.submissions.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

initDB();
