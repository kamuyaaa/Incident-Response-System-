const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param } = require('express-validator');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { handleValidation } = require('../middleware/validate');
const { sanitizeGuestReport } = require('../utils/sanitize');
const { handleUpload } = require('../middleware/upload');
const incidentController = require('../controllers/incidentController');

const router = express.Router();

const guestReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many reports from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const guestReportValidation = [
  body('type').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('description').trim().notEmpty().isLength({ max: 2000 }),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('coordinates').optional().isObject(),
  body('coordinates.latitude').optional().isFloat(),
  body('coordinates.longitude').optional().isFloat(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('guestReporter').optional().isObject(),
  body('guestReporter.name').optional().trim().isLength({ max: 200 }),
  body('guestReporter.phone').optional().trim().isLength({ max: 30 }),
  body('address').optional().trim().isLength({ max: 500 }),
  body('media').optional().isArray({ max: 10 }),
  body('media.*.url').optional().trim().isLength({ max: 2048 }),
  body('media.*.type').optional().trim().isLength({ max: 50 }),
  body().custom((value, { req }) => {
    const type = (req.body.type || req.body.category || '').trim();
    if (!type) throw new Error('Incident type or category is required');
    const lat = req.body.coordinates?.latitude ?? req.body.latitude;
    const lng = req.body.coordinates?.longitude ?? req.body.longitude;
    if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng)))
      throw new Error('Coordinates (latitude and longitude) are required');
    return true;
  }),
];

function sanitizeGuestReportBody(req, res, next) {
  try {
    req.body = sanitizeGuestReport(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

const createValidation = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('coordinates').optional().isArray({ min: 2, max: 2 }),
  body('coordinates.*').optional().isFloat(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('address').optional().trim(),
  body('locationText').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('responseDeadline').optional().isISO8601(),
  body('responseThresholdMinutes').optional().isInt({ min: 1 }),
  body().custom((value, { req }) => {
    const coords = req.body.coordinates;
    const lat = req.body.latitude;
    const lng = req.body.longitude;
    if (Array.isArray(coords) && coords.length >= 2) return true;
    if (lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) return true;
    throw new Error('Provide coordinates [lng, lat] or latitude and longitude');
  }),
];

const updateValidation = [
  body('status')
    .optional()
    .isIn([
      'reported',
      'validated',
      'escalated',
      'assigned',
      'en_route',
      'near_scene',
      'on_site',
      'resolving',
      'in_progress',
      'resolved',
      'cancelled',
    ]),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('validatedAt').optional().isISO8601(),
  body('resolvedAt').optional().isISO8601(),
  body('responseDeadline').optional().isISO8601(),
  body('responseThresholdMinutes').optional().isInt({ min: 1 }),
];

router.post(
  '/report/upload',
  guestReportLimiter,
  handleUpload,
  incidentController.guestReportUpload
);

router.post(
  '/report',
  guestReportLimiter,
  guestReportValidation,
  handleValidation,
  sanitizeGuestReportBody,
  incidentController.guestReport
);

router.post(
  '/',
  auth,
  requireRole('REPORTER', 'ADMIN'),
  createValidation,
  handleValidation,
  incidentController.create
);

router.get('/', auth, incidentController.list);

router.get(
  '/:id',
  auth,
  [param('id').isMongoId()],
  handleValidation,
  incidentController.getById
);

router.patch(
  '/:id',
  auth,
  requireRole('ADMIN', 'RESPONDER', 'SUPERVISOR'),
  [param('id').isMongoId(), ...updateValidation],
  handleValidation,
  incidentController.update
);

router.patch(
  '/:id/validate',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [param('id').isMongoId()],
  handleValidation,
  incidentController.validate
);

router.patch(
  '/:id/priority',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [param('id').isMongoId(), body('priority').isIn(['low', 'medium', 'high', 'critical'])],
  handleValidation,
  incidentController.prioritize
);

router.patch(
  '/:id/escalate',
  auth,
  requireRole('ADMIN', 'SUPERVISOR'),
  [param('id').isMongoId(), body('note').optional().isString().isLength({ max: 500 })],
  handleValidation,
  incidentController.escalate
);

module.exports = router;
