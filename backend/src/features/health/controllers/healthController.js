function getApiStatus(req, res) {
  res.json({
    message: 'Incident Response API is running...',
  });
}

module.exports = {
  getApiStatus,
};