import { FastifyRequest, FastifyReply } from 'fastify';
import { UserController } from '../../../src/infrastructure/http/controller/user.controller.js';

interface FastifyCustomRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Mock dependencies
jest.mock('../../../src/infrastructure/container/dependency-container');

describe('UserController', () => {
  let mockRequest: Partial<FastifyCustomRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {
      user: { 
        id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User'
      },
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
        name: 'Ezequiel Tavares',
        email: 'ezequiel@coodesh.com',
        password: 'hashedPassword',
      };

      const mockUserService = {
        getUserById: jest.fn().mockResolvedValue(user),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        userService: mockUserService,
      };

      await UserController.getProfile(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        id: 'user-id-123',
        name: 'Ezequiel Tavares',
        email: 'ezequiel@coodesh.com',
      });
    });

    it('should return 404 when user not found', async () => {
      const mockUserService = {
        getUserById: jest.fn().mockResolvedValue(null),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        userService: mockUserService,
      };

      await UserController.getProfile(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Usuário não encontrado',
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
        findByUser: jest.fn().mockResolvedValue(history),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        historyRepository: mockHistoryRepository,
      };

      await UserController.getHistory(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockHistoryRepository.findByUser).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith(history);
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
        findByUser: jest.fn().mockResolvedValue(favorites),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        favoriteRepository: mockFavoriteRepository,
      };

      await UserController.getFavorites(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockFavoriteRepository.findByUser).toHaveBeenCalledWith('user-id-123');
      expect(mockReply.send).toHaveBeenCalledWith(favorites);
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
        upsert: jest.fn().mockResolvedValue({
          id: 'favorite-1',
          word: {
            id: 'word-id-123',
            value: 'hello',
          },
        }),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      };

      await UserController.markFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockFavoriteRepository.upsert).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockReply.send).toHaveBeenCalledWith({
        id: 'favorite-1',
        word: {
          id: 'word-id-123',
          value: 'hello',
        },
      });
    });

    it('should return 404 when word not found', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const mockFavoriteRepository = {
        upsert: jest.fn() as any,
      };

      // Mock the static container property directly
      (UserController as any).container = {
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      };

      await UserController.markFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Palavra não encontrada',
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
        findByUserAndWord: jest.fn().mockResolvedValue({
          id: 'favorite-1',
          word: { id: 'word-id-123', value: 'hello' },
        }) as any,
        delete: jest.fn().mockResolvedValue(true) as any,
      };

      // Mock the static container property directly
      (UserController as any).container = {
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      };

      await UserController.unmarkFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockFavoriteRepository.findByUserAndWord).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockFavoriteRepository.delete).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockReply.code).toHaveBeenCalledWith(204);
      expect(mockReply.send).toHaveBeenCalledWith();
    });

    it('should return 404 when word not found', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const mockFavoriteRepository = {
        delete: jest.fn(),
      };

      // Mock the static container property directly
      (UserController as any).container = {
        wordRepository: mockWordRepository,
        favoriteRepository: mockFavoriteRepository,
      };

      await UserController.unmarkFavorite(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Palavra não encontrada',
      });
    });
  });
});