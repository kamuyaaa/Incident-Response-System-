/**
 * Rich demo seed data for the Emergency Response Coordination System.
 * Run: node scripts/seed-demo-data.js
 * Or use "Reset Demo Data" in the app (Admin) which calls POST /api/demo/reset.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Incident = require('../src/models/Incident');
const Assignment = require('../src/models/Assignment');
const Alert = require('../src/models/Alert');
const AuditLog = require('../src/models/AuditLog');
const { DEMO_ACCOUNTS_SPEC } = require('../src/data/demoAccounts');

const SALT_ROUNDS = 10;
const DEMO_USERS_SPEC = DEMO_ACCOUNTS_SPEC;

// ——— Kenyan location clusters (lng, lat) ———
const KENYA_CLUSTERS = [
  { lng: 36.817, lat: -1.292, name: 'Nairobi CBD', county: 'Nairobi' },
  { lng: 36.805, lat: -1.265, name: 'Westlands', county: 'Nairobi' },
  { lng: 36.698, lat: -1.319, name: 'Karen', county: 'Nairobi' },
  { lng: 36.835, lat: -1.308, name: 'South B', county: 'Nairobi' },
  { lng: 36.828, lat: -1.318, name: 'South C', county: 'Nairobi' },
  { lng: 36.848, lat: -1.285, name: 'Eastleigh', county: 'Nairobi' },
  { lng: 37.068, lat: -1.033, name: 'Thika', county: 'Kiambu' },
  { lng: 39.664, lat: -4.044, name: 'Mombasa', county: 'Mombasa' },
  { lng: 34.752, lat: -0.102, name: 'Kisumu', county: 'Kisumu' },
  { lng: 36.075, lat: -0.303, name: 'Nakuru', county: 'Nakuru' },
  { lng: 35.269, lat: 0.514, name: 'Eldoret', county: 'Uasin Gishu' },
  { lng: 37.262, lat: -1.518, name: 'Machakos', county: 'Machakos' },
  { lng: 36.950, lat: -0.417, name: 'Nyeri', county: 'Nyeri' },
];
const OFFSET = 0.012;

function randomInCluster(cluster) {
  return [
    cluster.lng + (Math.random() - 0.5) * OFFSET * 2,
    cluster.lat + (Math.random() - 0.5) * OFFSET * 2,
  ];
}

function hoursAgo(h) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d;
}

function daysAgo(d) {
  const x = new Date();
  x.setDate(x.getDate() - d);
  return x;
}

// ——— Incident templates: category, titles, descriptions (Kenya-relevant) ———
const INCIDENT_TEMPLATES = [
  { category: 'Fire', titles: ['Building fire', 'Vehicle fire', 'Brush fire', 'Kitchen fire', 'Matatu fire', 'Market fire'], desc: 'Fire reported at location. Smoke visible.' },
  { category: 'Medical Emergency', titles: ['Heart attack', 'Fall injury', 'Respiratory distress', 'Unconscious person', 'Severe bleeding', 'Road accident injuries', 'Child emergency'], desc: 'Medical emergency requiring immediate response.' },
  { category: 'Road Accident', titles: ['Multi-vehicle collision', 'Matatu accident', 'Motorcycle accident', 'Pedestrian struck', 'Hit and run', 'Boda boda crash'], desc: 'Traffic incident with possible injuries.' },
  { category: 'Security Threat', titles: ['Suspicious activity', 'Break-in in progress', 'Armed robbery', 'Disturbance', 'Theft in progress', 'Mugging reported'], desc: 'Security concern requiring response.' },
  { category: 'Rescue Request', titles: ['Person in water', 'Hiker stranded', 'Elevator entrapment', 'Collapsed structure', 'Missing person', 'Building collapse'], desc: 'Rescue or extraction needed.' },
  { category: 'Flood', titles: ['Flash flood', 'Flooded road', 'House flooding', 'Drainage blockage', 'River overflow'], desc: 'Flooding or water-related emergency.' },
];

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const INCIDENT_STATUSES = ['reported', 'validated', 'escalated', 'assigned', 'en_route', 'near_scene', 'on_site', 'resolving', 'resolved', 'cancelled'];

async function ensureDemoUsers() {
  const created = [];
  const nairobiCbd = KENYA_CLUSTERS[0];
  for (const u of DEMO_USERS_SPEC) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
      const cluster = u.role === 'RESPONDER' ? KENYA_CLUSTERS[Math.floor(Math.random() * KENYA_CLUSTERS.length)] : nairobiCbd;
      const loc = randomInCluster(cluster);
      user = await User.create({
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        serviceType: u.serviceType || undefined,
        location: { type: 'Point', coordinates: loc },
        isAvailable: true,
      });
      created.push(user.email);
    }
  }
  return created;
}

async function getDemoUserIds() {
  const users = await User.find({ email: { $in: DEMO_USERS_SPEC.map((u) => u.email) } }).lean();
  const byEmail = {};
  users.forEach((u) => { byEmail[u.email] = u._id; });
  return {
    admin: byEmail['admin@demo.com'],
    supervisor: byEmail['supervisor@demo.com'],
    reporters: [byEmail['reporter@demo.com'], byEmail['reporter2@demo.com'], byEmail['reporter3@demo.com']].filter(Boolean),
    responders: users.filter((u) => u.role === 'RESPONDER').map((u) => u._id),
    responderByType: {
      ambulance: users.filter((u) => u.serviceType === 'ambulance').map((u) => u._id),
      fire_truck: users.filter((u) => u.serviceType === 'fire_truck').map((u) => u._id),
      police: users.filter((u) => u.serviceType === 'police').map((u) => u._id),
      general: users.filter((u) => u.serviceType === 'general' || !u.serviceType).map((u) => u._id),
    },
  };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildStatusHistory(status, reportedAt, byId) {
  const hist = [{ status: 'reported', at: reportedAt, by: byId }];
  const now = new Date();
  if (status === 'reported') return hist;
  hist.push({ status: 'validated', at: new Date(reportedAt.getTime() + 15 * 60000), by: byId });
  if (status === 'validated') return hist;
  if (status === 'escalated') {
    hist.push({ status: 'escalated', at: new Date(reportedAt.getTime() + 20 * 60000), by: byId, note: 'Escalated for supervisor review.' });
    return hist;
  }
  hist.push({ status: 'assigned', at: new Date(reportedAt.getTime() + 25 * 60000), by: byId });
  if (status === 'assigned') return hist;
  hist.push({ status: 'en_route', at: new Date(reportedAt.getTime() + 32 * 60000), by: byId });
  if (status === 'en_route') return hist;
  hist.push({ status: 'near_scene', at: new Date(reportedAt.getTime() + 45 * 60000), by: byId });
  if (status === 'near_scene') return hist;
  hist.push({ status: 'on_site', at: new Date(reportedAt.getTime() + 55 * 60000), by: byId });
  if (status === 'on_site') return hist;
  hist.push({ status: 'resolving', at: new Date(reportedAt.getTime() + 65 * 60000), by: byId });
  if (status === 'resolving') return hist;
  // Back compat
  if (status === 'in_progress') {
    hist.push({ status: 'in_progress', at: new Date(reportedAt.getTime() + 35 * 60000), by: byId });
    return hist;
  }
  hist.push({ status: 'resolved', at: now, by: byId });
  return hist;
}

function kenyaPhone() {
  return '+254 7' + [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 78, 79][Math.floor(Math.random() * 29)] + ' ' + String(Math.floor(1000000 + Math.random() * 8999999));
}

async function seedIncidents(ids) {
  const incidents = [];
  const statusDistribution = [
    'reported', 'reported',
    'validated', 'validated',
    'escalated',
    'assigned', 'assigned',
    'en_route', 'near_scene', 'on_site', 'resolving',
    'resolved', 'resolved', 'resolved',
    'cancelled',
  ];
  const landmarks = ['near bus stage', 'opposite market', 'along highway', 'near school', 'next to hospital', 'at roundabout', 'near police station', 'along river'];
  for (let i = 0; i < 55; i++) {
    const cluster = pick(KENYA_CLUSTERS);
    const [lng, lat] = randomInCluster(cluster);
    const template = pick(INCIDENT_TEMPLATES);
    const title = pick(template.titles);
    const priority = pick(PRIORITIES);
    const status = pick(statusDistribution);
    const reportedAt = i < 25 ? hoursAgo(Math.random() * 48) : daysAgo(Math.floor(Math.random() * 7));
    const isGuest = i % 6 === 2;
    const reporterId = isGuest ? undefined : pick(ids.reporters);
    const guestReporter = isGuest ? { name: ['Anonymous', 'Caller', 'Witness'][i % 3], phone: kenyaPhone() } : undefined;
    const statusHistory = buildStatusHistory(status, reportedAt, ids.admin);
    const address = `${cluster.name}, ${cluster.county} – ${pick(landmarks)}`;
    const doc = {
      ...(reporterId ? { reporterId } : {}),
      ...(guestReporter ? { guestReporter } : {}),
      title: `${title} – ${cluster.name}`,
      type: template.category,
      category: template.category,
      description: template.desc + ' Location: ' + address,
      severity: priority,
      priority,
      status,
      location: { type: 'Point', coordinates: [lng, lat] },
      address,
      statusHistory,
      reportedAt,
      validatedAt: status !== 'reported' ? new Date(reportedAt.getTime() + 15 * 60000) : undefined,
      escalatedAt: status === 'escalated' ? new Date(reportedAt.getTime() + 20 * 60000) : undefined,
      escalatedBy: status === 'escalated' ? ids.admin : undefined,
      resolvedAt: status === 'resolved' ? new Date(reportedAt.getTime() + 90 * 60000) : undefined,
      responseThresholdMinutes: priority === 'critical' ? 15 : priority === 'high' ? 25 : 45,
    };
    const inc = await Incident.create(doc);
    incidents.push(inc);
  }
  return incidents;
}

async function seedAssignments(incidents, ids) {
  const assignments = [];
  const assignableStatuses = ['assigned', 'en_route', 'near_scene', 'on_site', 'resolving', 'in_progress', 'resolved'];
  for (const inc of incidents) {
    if (!assignableStatuses.includes(inc.status)) continue;
    const responderId = pick(ids.responders);
    const status =
      inc.status === 'resolved'
        ? 'completed'
        : inc.status === 'resolving'
          ? 'resolving'
          : inc.status === 'on_site'
            ? 'on_site'
            : inc.status === 'near_scene'
              ? 'near_scene'
              : inc.status === 'en_route' || inc.status === 'in_progress'
                ? pick(['en_route', 'near_scene'])
                : pick(['pending', 'accepted']);
    const assignedAt = inc.reportedAt ? new Date(inc.reportedAt.getTime() + 25 * 60000) : new Date();
    const a = await Assignment.create({
      incidentId: inc._id,
      responderId,
      assignedBy: pick([ids.admin, ids.supervisor]),
      status,
      assignedAt,
      acceptedAt: status !== 'pending' ? new Date(assignedAt.getTime() + 2 * 60000) : undefined,
      completedAt: status === 'completed' ? (inc.resolvedAt || new Date()) : undefined,
    });
    assignments.push(a);
  }
  return assignments;
}

async function seedAlerts(incidents) {
  const overdue = incidents.filter((i) => ['reported', 'validated'].includes(i.status) && i.reportedAt && (Date.now() - i.reportedAt) / 60000 > (i.responseThresholdMinutes || 30));
  const highPriority = incidents.filter((i) => i.priority === 'critical' || i.priority === 'high');
  const alerts = [];
  for (let i = 0; i < Math.min(12, overdue.length); i++) {
    const inc = overdue[i];
    const a = await Alert.create({
      incidentId: inc._id,
      type: 'response_time_exceeded',
      message: `Response threshold (${inc.responseThresholdMinutes || 30} min) exceeded for: ${inc.title}`,
      priority: inc.priority,
      acknowledged: Math.random() > 0.5,
    });
    alerts.push(a);
  }
  for (let i = 0; i < Math.min(5, highPriority.length) && alerts.length < 18; i++) {
    const inc = highPriority[i];
    if (alerts.some((a) => a.incidentId && a.incidentId.toString() === inc._id.toString())) continue;
    const a = await Alert.create({
      incidentId: inc._id,
      type: 'high_priority',
      message: `High-priority incident requires attention: ${inc.title}`,
      priority: inc.priority,
      acknowledged: false,
    });
    alerts.push(a);
  }
  return alerts;
}

async function seedAuditLogs(incidents, assignments, ids) {
  const entries = [];
  for (const inc of incidents.slice(0, 50)) {
    entries.push({
      actorId: inc.reporterId,
      actorRole: 'REPORTER',
      action: 'incident_created',
      entityType: 'Incident',
      entityId: inc._id.toString(),
      details: { title: inc.title, category: inc.category },
      resource: 'Incident',
      resourceId: inc._id.toString(),
      payload: { title: inc.title },
      timestamp: inc.reportedAt || inc.createdAt,
    });
  }
  for (const a of assignments) {
    entries.push({
      actorId: a.assignedBy,
      actorRole: 'ADMIN',
      action: 'assignment_create',
      entityType: 'Assignment',
      entityId: a._id.toString(),
      details: { incidentId: a.incidentId, responderId: a.responderId },
      resource: 'Assignment',
      resourceId: a._id.toString(),
      payload: { status: a.status },
      timestamp: a.assignedAt,
    });
  }
  for (const inc of incidents.filter((i) => ['validated', 'assigned', 'resolved'].includes(i.status)).slice(0, 20)) {
    entries.push({
      actorId: ids.admin,
      actorRole: 'ADMIN',
      action: 'incident_update',
      entityType: 'Incident',
      entityId: inc._id.toString(),
      details: { status: inc.status, title: inc.title },
      resource: 'Incident',
      resourceId: inc._id.toString(),
      payload: {},
      timestamp: inc.validatedAt || inc.reportedAt || inc.createdAt,
    });
  }
  if (entries.length) await AuditLog.insertMany(entries);
  return entries.length;
}

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ers';
  await mongoose.connect(mongoUri);

  const userCreated = await ensureDemoUsers();
  const ids = await getDemoUserIds();

  const incidentCountBefore = await Incident.countDocuments();
  const assignmentCountBefore = await Assignment.countDocuments();
  const alertCountBefore = await Alert.countDocuments();
  const auditCountBefore = await AuditLog.countDocuments();

  await Incident.deleteMany({});
  await Assignment.deleteMany({});
  await Alert.deleteMany({});
  await AuditLog.deleteMany({});

  const incidents = await seedIncidents(ids);
  const assignments = await seedAssignments(incidents, ids);
  const alerts = await seedAlerts(incidents);
  const auditCount = await seedAuditLogs(incidents, assignments, ids);

  await mongoose.disconnect();

  return {
    usersCreated: userCreated.length,
    usersTotal: DEMO_USERS_SPEC.length,
    incidentsCreated: incidents.length,
    assignmentsCreated: assignments.length,
    alertsCreated: alerts.length,
    auditEntriesCreated: auditCount,
  };
}

async function runSeedFromAPI() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ers';
  if (mongoose.connection.readyState !== 1) await mongoose.connect(mongoUri);
  const userCreated = await ensureDemoUsers();
  const ids = await getDemoUserIds();
  await Incident.deleteMany({});
  await Assignment.deleteMany({});
  await Alert.deleteMany({});
  await AuditLog.deleteMany({});
  const incidents = await seedIncidents(ids);
  const assignments = await seedAssignments(incidents, ids);
  const alerts = await seedAlerts(incidents);
  const auditCount = await seedAuditLogs(incidents, assignments, ids);
  return {
    usersCreated: userCreated.length,
    usersTotal: DEMO_USERS_SPEC.length,
    incidentsCreated: incidents.length,
    assignmentsCreated: assignments.length,
    alertsCreated: alerts.length,
    auditEntriesCreated: auditCount,
  };
}

if (require.main === module) {
  runSeed()
    .then((r) => {
      console.log('Demo seed complete:', r);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runSeed, runSeedFromAPI };
