const ROLES = ['REPORTER', 'ADMIN', 'RESPONDER', 'SUPERVISOR'];

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!allowedRoles.length || allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}

module.exports = { requireRole, ROLES };
