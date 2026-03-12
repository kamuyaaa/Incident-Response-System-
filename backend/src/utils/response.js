function success(res, data, status = 200) {
  return res.status(status).json({ data });
}

function list(res, items, meta = {}) {
  return res.json({ data: items, meta });
}

function error(res, message, status = 500) {
  return res.status(status).json({ error: message });
}

module.exports = { success, list, error };
