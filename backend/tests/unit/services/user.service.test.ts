import { UserService } from '../../../src/application/user.service.js';
import { IUserRepository } from '../../../src/domain/repositories/user.repository.interface.js';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 'user-id-123',
        name: userData.name,
        email: userData.email,
        password: 'hashedPassword123',
        createdAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: expect.any(String)
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw error when user creation fails', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
      };

      mockUserRepository.create.mockRejectedValue(new Error('Email already exists'));

      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const email = 'john@example.com';
      const user = {
        id: 'user-id-123',
        name: 'John Doe',
        email,
        password: 'hashedPassword123',
        createdAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await userService.getUserByEmail(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail(email);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = 'user-id-123';
      const user = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
        createdAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(user);

      const result = await userService.getUserById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      const userId = 'nonexistent-id';

      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-id-123';
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const updatedUser = {
        id: userId,
        ...updateData,
        password: 'hashedPassword123',
        createdAt: new Date(),
      };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user-id-123';

      mockUserRepository.delete.mockResolvedValue(undefined);

      await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should handle user deletion errors', async () => {
      const userId = 'user-id-123';

      mockUserRepository.delete.mockRejectedValue(new Error('User not found'));

      await expect(userService.deleteUser(userId)).rejects.toThrow('User not found');
    });
  });
});