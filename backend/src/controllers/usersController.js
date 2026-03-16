const User = require('../models/User');

async function listResponders(req, res, next) {
  try {
    const users = await User.find({ role: 'RESPONDER' })
      .select('name email isAvailable location serviceType capabilities')
      .lean();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

module.exports = { listResponders };
