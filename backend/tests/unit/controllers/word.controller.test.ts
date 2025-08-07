import { FastifyRequest, FastifyReply } from 'fastify';
import { WordController } from '../../../src/infrastructure/http/controller/word.controller.js';
import { DependencyContainer } from '../../../src/infrastructure/container/dependency-container.js';
import { FastifyCustomRequest } from '../../../src/infrastructure/types/fastify.js';

// Mock dependencies
jest.mock('../../../src/infrastructure/container/dependency-container');

describe('WordController', () => {
  let mockRequest: Partial<FastifyCustomRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {
      user: { id: 'user-id-123' },
      params: {},
      query: {},
      log: {
        error: jest.fn(),
      } as any,
    };

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('getWords', () => {
    it('should return words with pagination successfully', async () => {
      mockRequest.query = { search: 'hello', limit: '10', page: '1' };

      const words = [
        { id: 'word-1', value: 'hello' },
        { id: 'word-2', value: 'help' },
      ];

      const mockWordRepository = {
        findMany: jest.fn().mockResolvedValue({
          words,
          totalCount: 2,
          hasNextPage: false,
        }),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await WordController.getWords(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findMany).toHaveBeenCalledWith({
        search: 'hello',
        limit: 10,
        cursor: undefined,
      });

      expect(mockReply.send).toHaveBeenCalledWith({
        results: words,
        totalDocs: 2,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle empty search results', async () => {
      mockRequest.query = { search: 'nonexistent' };

      const mockWordRepository = {
        findMany: jest.fn().mockResolvedValue({
          words: [],
          totalCount: 0,
          hasNextPage: false,
        }),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await WordController.getWords(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith({
        results: [],
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('getWord', () => {
    it('should return word definition successfully', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const word = { id: 'word-id-123', value: 'hello' };
      const definition = {
        word: 'hello',
        phonetics: [{ text: '/həˈloʊ/' }],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'A greeting' }],
          },
        ],
        fromCache: false,
      };

      const favorite = { id: 'favorite-1', userId: 'user-id-123', wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(word),
      };

      const mockDictionaryService = {
        searchWord: jest.fn().mockResolvedValue(definition),
      };

      const mockHistoryRepository = {
        upsert: jest.fn().mockResolvedValue({}),
      };

      const mockFavoriteRepository = {
        findByUserAndWord: jest.fn().mockResolvedValue(favorite),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
        historyRepository: mockHistoryRepository,
        favoriteRepository: mockFavoriteRepository,
      });

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findById).toHaveBeenCalledWith('word-id-123');
      expect(mockDictionaryService.searchWord).toHaveBeenCalledWith('hello');
      expect(mockHistoryRepository.upsert).toHaveBeenCalledWith('user-id-123', 'word-id-123');
      expect(mockFavoriteRepository.findByUserAndWord).toHaveBeenCalledWith('user-id-123', 'word-id-123');

      expect(mockReply.header).toHaveBeenCalledWith('x-cache', 'MISS');
      expect(mockReply.send).toHaveBeenCalledWith({
        ...definition,
        id: 'word-id-123',
        isFavorite: true,
      });
    });

    it('should return 404 when word not found in database', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word not found',
      });
    });

    it('should return 404 when word not found in dictionary', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const word = { id: 'word-id-123', value: 'nonexistent' };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(word),
      };

      const mockDictionaryService = {
        searchWord: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
      });

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Word not found in dictionary',
      });
    });

    it('should handle cache hit', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const word = { id: 'word-id-123', value: 'hello' };
      const definition = {
        word: 'hello',
        phonetics: [{ text: '/həˈloʊ/' }],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'A greeting' }],
          },
        ],
        fromCache: true,
      };

      const mockWordRepository = {
        findById: jest.fn().mockResolvedValue(word),
      };

      const mockDictionaryService = {
        searchWord: jest.fn().mockResolvedValue(definition),
      };

      const mockHistoryRepository = {
        upsert: jest.fn().mockResolvedValue({}),
      };

      const mockFavoriteRepository = {
        findByUserAndWord: jest.fn().mockResolvedValue(null),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
        historyRepository: mockHistoryRepository,
        favoriteRepository: mockFavoriteRepository,
      });

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.header).toHaveBeenCalledWith('x-cache', 'HIT');
      expect(mockReply.send).toHaveBeenCalledWith({
        ...definition,
        id: 'word-id-123',
        isFavorite: false,
      });
    });

    it('should handle internal server error', async () => {
      mockRequest.params = { wordId: 'word-id-123' };

      const mockWordRepository = {
        findById: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (DependencyContainer.getInstance as jest.Mock).mockReturnValue({
        wordRepository: mockWordRepository,
      });

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});