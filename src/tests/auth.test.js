const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

// Import des fonctions globales de Jest
const { describe, it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');

let mongoServer;
let server;

beforeAll(async () => {
  // Augmenter le timeout pour la création du serveur MongoDB en mémoire
  jest.setTimeout(30000);

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  await mongoose.disconnect(); // S'assurer qu'il n'y a pas de connexion existante
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 30000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  // Fermer le serveur Express
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
}, 30000);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    }, 10000); // Timeout de 10s pour ce test
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // Créer un utilisateur
      await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      // Tester le login
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
    }, 10000); // Timeout de 10s pour ce test
  });
});
