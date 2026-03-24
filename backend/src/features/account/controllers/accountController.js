const User = require('../../auth/models/User');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ id: userId });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    profilePhoto: user.profilePhoto || '',
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullname, email, phone, profilePhoto } = req.body;

  const user = await User.findOne({ id: userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (email && email.toLowerCase() !== user.email) {
    const duplicateUser = await User.findOne({ email: email.toLowerCase(), id: { $ne: userId } });
    if (duplicateUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
  }

  user.fullname = fullname ?? user.fullname;
  user.email = email ? email.toLowerCase() : user.email;
  user.phone = phone ?? user.phone;
  user.profilePhoto = profilePhoto ?? user.profilePhoto;
  await user.save();

  return res.json({
    success: true,
    data: {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto || '',
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
};