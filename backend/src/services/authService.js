const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config');
const auditService = require('./auditService');

const SALT_ROUNDS = 10;

async function register({ email, password, name, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 400 });
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email,
    passwordHash,
    name,
    role: role || 'REPORTER',
  });
  await auditService.append(user._id, user.role, 'register', 'User', user._id.toString(), { email, role: user.role });
  return userToJSON(user);
}

async function login(email, password) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  const ok = await user.comparePassword(password);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  await auditService.append(user._id, user.role, 'login', 'User', user._id.toString());
  const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, { expiresIn: jwtExpiresIn });
  return { user: userToJSON(user), token };
}

function userToJSON(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.passwordHash;
  u.id = u._id?.toString();
  return u;
}

module.exports = { register, login, userToJSON };
