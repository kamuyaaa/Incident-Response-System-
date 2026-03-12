const alertService = require('./alertService');

const OVERDUE_CHECK_INTERVAL_MS = 60 * 1000;
let overdueIntervalId = null;

function startOverdueAlertScheduler() {
  if (overdueIntervalId) return;
  overdueIntervalId = setInterval(async () => {
    try {
      await alertService.runOverdueCheck();
    } catch (err) {
      console.error('Overdue alert check failed:', err.message);
    }
  }, OVERDUE_CHECK_INTERVAL_MS);
  console.log('Overdue alert scheduler started (interval: %ds)', OVERDUE_CHECK_INTERVAL_MS / 1000);
}

function stopOverdueAlertScheduler() {
  if (overdueIntervalId) {
    clearInterval(overdueIntervalId);
    overdueIntervalId = null;
    console.log('Overdue alert scheduler stopped');
  }
}

module.exports = {
  startOverdueAlertScheduler,
  stopOverdueAlertScheduler,
  OVERDUE_CHECK_INTERVAL_MS,
};
