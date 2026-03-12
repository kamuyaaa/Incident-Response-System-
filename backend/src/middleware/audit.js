const auditService = require('../services/auditService');

function logAction(action, resource, getResourceId = (req) => req.params.id) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 400 && req.user) {
        const resourceId = typeof getResourceId === 'function' ? getResourceId(req, body) : getResourceId;
        auditService
          .append(req.user._id, req.user.role, action, resource, resourceId, { body: body?.data ?? body })
          .catch((err) => console.error('Audit append failed:', err));
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { logAction };
