const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // clean database between tests
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

describe('Appointment CRUD flow', () => {
  test('patient can book appointment; doctor can update status and add advice', async () => {
    // Register a doctor
    const doctorRes = await request(app).post('/api/auth/register/doctor').send({
      email: 'doc1@example.com',
      password: 'Password1A',
      firstName: 'Doc',
      lastName: 'One',
      specialization: 'Cardiology',
      licenseNumber: 'LIC12345',
      phone: '1234567890',
      department: 'Cardio'
    });

    expect(doctorRes.statusCode).toBe(201);
    const doctorToken = doctorRes.body.token;
    const doctorId = doctorRes.body.user.profile._id || doctorRes.body.user.profile.id || doctorRes.body.user.profile;

    // Register a patient
    const patientRes = await request(app).post('/api/auth/register/patient').send({
      email: 'patient1@example.com',
      password: 'Password1A',
      firstName: 'Patient',
      lastName: 'One',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      phone: '0987654321'
    });

    expect(patientRes.statusCode).toBe(201);
    const patientToken = patientRes.body.token;

    // Patient books appointment with doctor
    const bookRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId,
        appointmentDate: new Date().toISOString(),
        appointmentTime: '10:00',
        reason: 'Routine check'
      });

    expect(bookRes.statusCode).toBe(201);
    const appointment = bookRes.body;
    expect(appointment).toHaveProperty('_id');
    expect(appointment.status).toBe('scheduled');

    // Patient can fetch their appointments
    const patientList = await request(app)
      .get('/api/appointments/patient')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(patientList.statusCode).toBe(200);
    expect(Array.isArray(patientList.body)).toBe(true);
    expect(patientList.body.length).toBe(1);

    // Doctor updates appointment status to checked-in
    const statusRes = await request(app)
      .patch(`/api/appointments/${appointment._id}/status`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ status: 'checked-in' });

    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.status).toBe('checked-in');

    // Doctor adds advice and completes appointment
    const adviceRes = await request(app)
      .patch(`/api/appointments/${appointment._id}/advice`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ advice: 'Take rest', prescription: 'Med 1' });

    expect(adviceRes.statusCode).toBe(200);
    expect(adviceRes.body.advice).toBe('Take rest');
    expect(adviceRes.body.status).toBe('completed');
  }, 30000);
});
