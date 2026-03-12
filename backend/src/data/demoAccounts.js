/**
 * Single source of truth for demo/login test accounts.
 * Used by seed-demo-data.js and GET /api/demo/accounts.
 * All accounts here are intended for testing and can be used to log in.
 */

const DEMO_ACCOUNTS_SPEC = [
  { email: 'admin@demo.com', password: 'Admin123!', name: 'Kenya ERS Admin', role: 'ADMIN' },
  { email: 'supervisor@demo.com', password: 'Supervisor123!', name: 'Supervisor Mwangi', role: 'SUPERVISOR' },
  { email: 'reporter@demo.com', password: 'Reporter123!', name: 'Grace Wanjiku', role: 'REPORTER' },
  { email: 'reporter2@demo.com', password: 'Reporter123!', name: 'Peter Ochieng', role: 'REPORTER' },
  { email: 'reporter3@demo.com', password: 'Reporter123!', name: 'Faith Akinyi', role: 'REPORTER' },
  { email: 'responder@demo.com', password: 'Responder123!', name: 'Response Unit 1', role: 'RESPONDER', serviceType: 'general' },
  { email: 'ambulance1@demo.com', password: 'Responder123!', name: 'KEMSA Ambulance Nairobi 1', role: 'RESPONDER', serviceType: 'ambulance' },
  { email: 'ambulance2@demo.com', password: 'Responder123!', name: 'St John Ambulance Mombasa', role: 'RESPONDER', serviceType: 'ambulance' },
  { email: 'ambulance3@demo.com', password: 'Responder123!', name: 'Red Cross EMS Kisumu', role: 'RESPONDER', serviceType: 'ambulance' },
  { email: 'fire1@demo.com', password: 'Responder123!', name: 'Nairobi Fire Station 1', role: 'RESPONDER', serviceType: 'fire_truck' },
  { email: 'fire2@demo.com', password: 'Responder123!', name: 'Mombasa Fire Rescue', role: 'RESPONDER', serviceType: 'fire_truck' },
  { email: 'fire3@demo.com', password: 'Responder123!', name: 'Nakuru County Fire', role: 'RESPONDER', serviceType: 'fire_truck' },
  { email: 'police1@demo.com', password: 'Responder123!', name: 'Kenya Police Patrol Westlands', role: 'RESPONDER', serviceType: 'police' },
  { email: 'police2@demo.com', password: 'Responder123!', name: 'APS Unit CBD', role: 'RESPONDER', serviceType: 'police' },
  { email: 'police3@demo.com', password: 'Responder123!', name: 'Traffic Police Thika Road', role: 'RESPONDER', serviceType: 'police' },
];

module.exports = { DEMO_ACCOUNTS_SPEC };
