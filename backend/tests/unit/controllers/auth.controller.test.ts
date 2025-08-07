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
    };

    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock DependencyContainer
    (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
      userService: {
        createUser: jest.fn(),
        getUserByEmail: jest.fn(),
      },
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRequest.body = userData;

      const hashedPassword = 'hashedPassword123';
      const userId = 'user-id-123';
      const token = 'jwt-token-123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const mockUserService = {
        createUser: jest.fn().mockResolvedValue({ id: userId }),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      await AuthController.signUp(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'User created successfully',
        token,
      });
    });

    it('should handle user creation error', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRequest.body = userData;

      const mockUserService = {
        createUser: jest.fn().mockRejectedValue(new Error('Email already exists')),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await AuthController.signUp(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should handle internal server error', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
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
    it('should sign in user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockRequest.body = loginData;

      const user = {
        id: 'user-id-123',
        email: 'john@example.com',
        password: 'hashedPassword123',
        name: 'John Doe',
      };

      const token = 'jwt-token-123';

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(user),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user-id-123' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Login successful',
        token,
      });
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockRequest.body = loginData;

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

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
      };

      const mockUserService = {
        getUserByEmail: jest.fn().mockResolvedValue(user),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await AuthController.signIn(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });
});