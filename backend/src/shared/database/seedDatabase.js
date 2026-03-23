const User = require('../../features/auth/models/User');
const Incident = require('../../features/incidents/models/Incident');

async function seedDatabase() {
  const existingUsersCount = await User.countDocuments();
  if (existingUsersCount > 0) {
    return;
  }

  await User.insertMany([
    {
      id: 'u-admin-1',
      fullname: 'Admin User',
      email: 'admin@safereport.com',
      phone: '+254700000001',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 'u-reporter-1',
      fullname: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '+2547361907387',
      password: 'reporter123',
      role: 'reporter',
    },
    {
      id: 'u-responder-1',
      fullname: 'Responder Jane',
      email: 'responder@safereport.com',
      phone: '+254700000002',
      password: 'responder123',
      role: 'responder',
    },
  ]);

  await Incident.insertMany([
    {
      id: 'INC-10003',
      reporterId: 'u-reporter-1',
      type: 'Medical Emergency',
      description: 'A person has collapsed near TRM entrance and is not responding.',
      location: 'TRM, Thika Road',
      status: 'In Progress',
      priority: 'High',
      responderId: 'u-responder-1',
      createdAt: new Date('2026-02-13T09:15:00.000Z'),
    },
    {
      id: 'INC-50003',
      reporterId: 'u-reporter-1',
      type: 'Fire & Rescue',
      description: 'Fire in a residential building in Eastleigh, Nairobi.',
      location: 'Eastleigh, Nairobi',
      status: 'Completed',
      priority: 'Critical',
      responderId: 'u-responder-1',
      createdAt: new Date('2026-02-09T18:30:00.000Z'),
    },
    {
      id: 'INC-77777',
      reporterId: 'u-reporter-1',
      type: 'Crime & Safety',
      description: 'Suspicious activity reported near a closed shop.',
      location: 'Ngara, Nairobi',
      status: 'Unassigned',
      priority: 'Medium',
      responderId: null,
      createdAt: new Date('2026-02-15T20:05:00.000Z'),
    },
  ]);
}

module.exports = seedDatabase;