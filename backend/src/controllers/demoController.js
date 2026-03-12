const { runSeedFromAPI } = require('../../scripts/seed-demo-data');
const { DEMO_ACCOUNTS_SPEC } = require('../data/demoAccounts');

async function reset(req, res, next) {
  try {
    const result = await runSeedFromAPI();
    res.json({
      message: 'Demo data reset and re-seeded.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

function listAccounts(req, res) {
  const accounts = DEMO_ACCOUNTS_SPEC.map((u) => ({
    email: u.email,
    name: u.name,
    role: u.role,
    password: u.password,
    serviceType: u.serviceType || undefined,
  }));
  res.json({ data: accounts });
}

module.exports = { reset, listAccounts };
