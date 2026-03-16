export const AUTH = {
  register: '/auth/register',
  login: '/auth/login',
  me: '/auth/me',
};

export const DASHBOARD = '/dashboard';

export const INCIDENTS = {
  list: '/incidents',
  one: (id) => `/incidents/${id}`,
  create: '/incidents',
  report: '/incidents/report',
  reportUpload: '/incidents/report/upload',
  update: (id) => `/incidents/${id}`,
  validate: (id) => `/incidents/${id}/validate`,
  priority: (id) => `/incidents/${id}/priority`,
  escalate: (id) => `/incidents/${id}/escalate`,
};

export const ASSIGNMENTS = {
  my: '/assignments/my',
  recommend: (incidentId) => `/assignments/recommend/${incidentId}`,
  create: '/assignments',
  status: (id) => `/assignments/${id}/status`,
  byIncident: (incidentId) => `/assignments/incident/${incidentId}`,
};

export const TRACKING = {
  byIncident: (incidentId) => `/tracking/${incidentId}`,
};

export const ALERTS = {
  list: '/alerts',
  acknowledge: (id) => `/alerts/${id}/acknowledge`,
};

export const AUDIT = {
  list: '/audit',
};

export const USERS = {
  responders: '/users/responders',
};

export const DEMO = {
  reset: '/demo/reset',
  accounts: '/demo/accounts',
};
