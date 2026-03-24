const User = require('../models/User');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { fullname, email, phone, password, role = 'reporter' } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ message: 'fullname, email, phone and password are required' });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const sameRoleUsersCount = await User.countDocuments({ role });
  const newUser = await User.create({
    id: `u-${role}-${sameRoleUsersCount + 1}`,
    fullname,
    email: normalizedEmail,
    phone,
    password,
    role,
  });

  return res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser.id,
      name: newUser.fullname,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    password,
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token: `mock-token-${user.id}`,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone, newPassword } = req.body;

  if (!email || !phone || !newPassword) {
    return res.status(400).json({ message: 'email, phone and newPassword are required' });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    phone,
  });

  if (!user) {
    return res.status(404).json({ message: 'No account matches the provided email and phone number' });
  }

  user.password = newPassword;
  await user.save();

  return res.json({ message: 'Password reset successful. You can now log in with your new password.' });
});

module.exports = {
  register,
  login,
  forgotPassword,
};