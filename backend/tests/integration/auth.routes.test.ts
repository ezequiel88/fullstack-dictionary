import { FastifyInstance } from 'fastify';
import { build } from '../../src/server.js';
import prisma from '../../src/infrastructure/database/prisma.js';

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.favorite.deleteMany();
    await prisma.history.deleteMany();
    await prisma.user.deleteMany();
    await prisma.word.deleteMany();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Ezequiel Tavares',
        email: 'ezequiel@coodesh.com',
        password: 'Sucesso@2025',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: userData,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('User created successfully');
      expect(body.token).toBeDefined();
      expect(typeof body.token).toBe('string');

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeTruthy();
      expect(user?.name).toBe(userData.name);
      expect(user?.email).toBe(userData.email);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'Ezequiel Tavares',
        email: 'ezequiel@coodesh.com',
        password: 'Sucesso@2025',
      };

      // Create user first time
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: userData,
      });

      // Try to create same user again
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: userData,
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('Email already exists');
    });

    it('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name: 'Miguel Tavares',
          // missing email and password
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name: 'Ezequiel Tavares',
          email: 'babaloo',
          password: 'Sucesso@2025',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate password length', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name: 'Ezequiel Tavares',
          email: 'ezequiel@coodesh.com',
          password: 'Bah',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/signin', () => {
    beforeEach(async () => {
      // Create a test user before each signin test
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name: 'Ezequiel Tavares',
          email: 'ezequiel@coodesh.com',
          password: 'Sucesso@2025',
        },
      });
    });

    it('should sign in user successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email: 'ezequiel@coodesh.com',
          password: 'Sucesso@2025',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('Login successful');
      expect(body.token).toBeDefined();
      expect(typeof body.token).toBe('string');
    });

    it('should return error for invalid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email: 'querocafe@coodesh.com',
          password: 'Sucesso@2025',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('Invalid credentials');
    });

    it('should return error for invalid password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email: 'ezequiel@coodesh.com',
          password: 'coisadelouco',
        },
      });

      expect(response.statusCode).toBe(401);

      const body = JSON.parse(response.body);
      expect(body.message).toBe('Invalid credentials');
    });

    it('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
        email: 'ezequiel@coodesh.com',
          // missing password
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});