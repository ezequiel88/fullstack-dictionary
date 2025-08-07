import { FastifyRequest, FastifyReply } from 'fastify';
import { WordController } from '../../../src/infrastructure/http/controller/word.controller.js';
import { DependencyContainer } from '../../../src/infrastructure/container/dependency-container.js';

// Mock dependencies
jest.mock('../../../src/infrastructure/container/dependency-container');

interface FastifyCustomRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

describe('WordController', () => {
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
    // Reset the static container property
    (WordController as any).container = undefined;
  });

  describe('getWordsList', () => {
    it('should return words with pagination successfully', async () => {
      mockRequest.query = { search: 'hello', limit: '10', page: '1' };

      const words = [
        { id: 'word-1', value: 'hello' },
        { id: 'word-2', value: 'help' },
      ];

      const response = {
        results: words,
        totalDocs: 2,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: false,
      };

      const mockWordRepository = {
        findMany: jest.fn().mockResolvedValue(response),
      };

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
      };

      await WordController.getWordsList(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockWordRepository.findMany).toHaveBeenCalledWith({
        search: 'hello',
        limit: '10',
        page: '1',
      });

      expect(mockReply.send).toHaveBeenCalledWith(response);
    });

    it('should handle empty search results', async () => {
      mockRequest.query = { search: 'nonexistent' };

      const response = {
        results: [],
        totalDocs: 0,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: false,
      };

      const mockWordRepository = {
        findMany: jest.fn().mockResolvedValue(response),
      };

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
      };

      await WordController.getWordsList(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith(response);
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

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
        historyRepository: mockHistoryRepository,
        favoriteRepository: mockFavoriteRepository,
      };

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

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
      };

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

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
      };

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

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
        dictionaryService: mockDictionaryService,
        historyRepository: mockHistoryRepository,
        favoriteRepository: mockFavoriteRepository,
      };

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

      // Mock the static container property directly
      (WordController as any).container = {
        wordRepository: mockWordRepository,
      };

      await WordController.getWord(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});