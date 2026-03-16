const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config');

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();
  const token = header.slice(7);
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err || !decoded) return next();
    try {
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (user) req.user = user;
    } catch (_) {}
    next();
  });
}

module.exports = { auth, optionalAuth };
