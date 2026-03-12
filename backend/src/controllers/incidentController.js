const incidentService = require('../services/incidentService');

async function create(req, res, next) {
  try {
    const incident = await incidentService.create(req.user._id, req.body);
    res.status(201).json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const filters = {};
    if (req.user.role === 'REPORTER') filters.reporterId = req.user._id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    const result = await incidentService.list(filters, {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 20, 100),
    });
    res.json({ data: result.items, meta: { total: result.total, page: result.page, limit: result.limit } });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const incident = await incidentService.getById(req.params.id);
    if (req.user.role === 'REPORTER' && incident.reporterId?._id?.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Insufficient permissions' });
    res.json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const incident = await incidentService.update(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );
    res.json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function validate(req, res, next) {
  try {
    const incident = await incidentService.update(
      req.params.id,
      { status: 'validated', validatedAt: new Date() },
      req.user._id,
      req.user.role
    );
    res.json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function prioritize(req, res, next) {
  try {
    const incident = await incidentService.update(
      req.params.id,
      { priority: req.body.priority },
      req.user._id,
      req.user.role
    );
    res.json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function guestReport(req, res, next) {
  try {
    const incident = await incidentService.createGuestReport(req.body);
    res.status(201).json({ data: incident });
  } catch (err) {
    next(err);
  }
}

async function guestReportUpload(req, res, next) {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ data: { url } });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, guestReport, guestReportUpload, list, getById, update, validate, prioritize };
