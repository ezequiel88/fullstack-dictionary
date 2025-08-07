import { FastifyRequest, FastifyReply } from 'fastify';
import { UserController } from '../../../src/infrastructure/http/controller/user.controller.js';
import { DependencyContainer } from '../../../src/infrastructure/container/dependency-container.js';
import { FastifyCustomRequest } from '../../../src/infrastructure/types/fastify.js';

// Mock dependencies
jest.mock('../../../src/infrastructure/container/dependency-container');

describe('UserController', () => {
  let mockRequest: Partial<FastifyCustomRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {
      user: { id: 'user-id-123' },
      params: {},
      log: {
        error: jest.fn(),
      } as any,
    };

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const user = {
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const mockUserService = {
        getUserById: jest.fn().mockResolvedValue(user),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      await UserController.getProfile(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should return 404 when user not found', async () => {
      const mockUserService = {
        getUserById: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        userService: mockUserService,
      });

      await UserController.getProfile(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });
  });

  describe('getHistory', () => {
    it('should return user history successfully', async () => {
      const history = [
        {
          id: 'history-1',
          word: { id: 'word-1', value: 'hello' },
          added: new Date(),
        },
      ];

      const mockHistoryRepository = {
        findByUserId: jest.fn().mockResolvedValue(history),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        historyRepository: mockHistoryRepository,
      });

      await UserController.getHistory(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockHistoryRepository.findByUserId).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        results: history,
        totalDocs: history.length,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('getFavorites', () => {
    it('should return user favorites successfully', async () => {
      const favorites = [
        {
          id: 'favorite-1',
          word: { id: 'word-1', value: 'hello' },
          added: new Date(),
        },
      ];

      const mockFavoriteRepository = {
        findByUserId: jest.fn().mockResolvedValue(favorites),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        favoriteRepository: mockFavoriteRepository,
      });

      await UserController.getFavorites(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockFavoriteRepository.findByUserId).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        results: favorites,
        totalDocs: favorites.length,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('markFavorite', () => {
    it('should mark word as favorite successfully', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const word = { id: 'word-id-123', value: 'hello' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(word),
      };

      const mockFavoriteRepository = {
        create: jest.fn().mockResolvedValue({
          id: 'favorite-1',
          userId: 'user-id-123',
          wordId: 'word-id-123',
        }),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      });

      await UserController.markFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockFavoriteRepository.create).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word marked as favorite',
      });
    });

    it('should return 404 when word not found', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await UserController.markFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word not found',
      });
    });
  });

  describe('unmarkFavorite', () => {
    it('should unmark word as favorite successfully', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const word = { id: 'word-id-123', value: 'hello' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(word),
      };

      const mockFavoriteRepository = {
        delete: jest.fn().mockResolvedValue(true),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      });

      await UserController.unmarkFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockFavoriteRepository.delete).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word unmarked as favorite',
      });
    });

    it('should return 404 when word not found', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await UserController.unmarkFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word not found',
      });
    });
  });
});