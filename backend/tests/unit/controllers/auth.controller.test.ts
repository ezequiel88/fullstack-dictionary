import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthController } from '../../../src/infrastructure/http/controller/auth.controller.js';
import { DependencyContainer } from '../../../src/infrastructure/container/dependency-container.js';
import { IUserRepository } from '../../../src/domain/repositories/user.repository.interface.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../src/infrastructure/container/dependency-container');

describe('AuthController', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      log: {
        error: jest.fn(),
      } as any,
    };

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      jwtSign: jest.fn().mockResolvedValue('jwt-token-123'),
    };

    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Reset the static container property
    (AuthController as any).container = undefined;

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      mockRequest.body = userData;

      const hashedPassword = 'hashedPassword123';
      const userId = 'user-id-123';
      const token = 'jwt-token-123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const user = {
        id: userId,
        email: 'john@example.com',
        name: 'John Doe',
        createdAt: new Date(),
      };

      const mockUserService = {
        createUser: jest.fn().mockResolvedValue(user),
        getUserByEmail: jest.fn().mockResolvedValue(null),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      await AuthController.signUp(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      });
      expect(mockReply.jwtSign).toHaveBeenCalledWith({ id: userId, email: 'john@example.com' });
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: {
          id: userId,
          email: 'john@example.com',
          name: 'John Doe',
          createdAt: user.createdAt,
        },
        token: 'jwt-token-123',
      });
    });

    it('should handle user creation error', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      mockRequest.body = userData;

      const mockUserService = {
        createUser: jest.fn().mockRejectedValue(new Error('Email already exists')),
        getUserByEmail: jest.fn().mockResolvedValue(null),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await AuthController.signUp(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });

    it('should handle internal server error', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      };

      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      await AuthController.signUp(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('signIn', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Reset the static container property
      (AuthController as any).container = undefined;
    });

    it('should sign in user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123',
      };

      mockRequest.body = loginData;

      const user = {
        id: 'user-id-123',
        email: 'john@example.com',
        password: 'hashedPassword123',
        name: 'John Doe',
        createdAt: new Date(),
      };

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(user),
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserService.validatePassword).toHaveBeenCalledWith('Password123', 'hashedPassword123');
      expect(mockReply.jwtSign).toHaveBeenCalledWith({ id: 'user-id-123', email: 'john@example.com' });
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 'user-id-123',
          email: 'john@example.com',
          name: 'John Doe',
          createdAt: user.createdAt,
        },
        token: 'jwt-token-123',
      });
    });

    it('should handle invalid credentials (user not found)', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockRequest.body = loginData;

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        validatePassword: jest.fn(),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserService.validatePassword).not.toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return error for wrong password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockRequest.body = loginData;

      const user = {
        id: 'user-id-123',
        email: 'john@example.com',
        password: 'hashedPassword123',
        name: 'John Doe',
        createdAt: new Date(),
      };

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(user),
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserService.validatePassword).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should handle internal server error', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123',
      };

      mockRequest.body = loginData;

      const mockUserService = {
        getUserByEmail: jest.fn().mockRejectedValue(new Error('Database error')),
        validatePassword: jest.fn(),
      };

      // Mock the static container property directly
      (AuthController as any).container = {
        userService: mockUserService,
      };

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});