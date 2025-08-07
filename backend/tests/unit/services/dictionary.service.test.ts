import { DictionaryService } from '../../../src/application/dictionary.service.js';
import { IDictionaryService } from '../../../src/domain/services/dictionary.service.interface.js';
import { ICacheService } from '../../../src/domain/services/cache.service.interface.js';
import { WordDefinition } from '../../../src/domain/entities/word-definition.entity.js';

describe('DictionaryService', () => {
  let dictionaryService: DictionaryService;
  let mockExternalDictionaryService: jest.Mocked<IDictionaryService>;
  let mockCacheService: jest.Mocked<ICacheService>;

  beforeEach(() => {
    mockExternalDictionaryService = {
      getWordDefinition: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      clear: jest.fn(),
    };

    dictionaryService = new DictionaryService(mockExternalDictionaryService, mockCacheService);
  });

  describe('searchWord', () => {
    const word = 'hello';
    const wordDefinition = {
      word: 'hello',
      phonetics: [{ text: '/həˈloʊ/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [{ definition: 'A greeting' }],
        },
      ],
    };

    it('should return cached result when available', async () => {
      const cachedResult = { ...wordDefinition, fromCache: true };
      mockCacheService.get.mockResolvedValue(JSON.stringify(wordDefinition));

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResult);
    });

    it('should fetch from external service when not cached', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(wordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `word:${word}`,
        JSON.stringify(wordDefinition),
        3600
      );
      expect(result).toEqual({ ...wordDefinition, fromCache: false });
    });

    it('should return null when word not found', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(null);

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(mockCacheService.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle cache get error gracefully', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Cache error'));
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(wordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(result).toEqual({ ...wordDefinition, fromCache: false });
    });

    it('should handle cache set error gracefully', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockCacheService.set.mockRejectedValue(new Error('Cache set error'));
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(wordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(result).toEqual({ ...wordDefinition, fromCache: false });
    });

    it('should handle invalid cached JSON gracefully', async () => {
      mockCacheService.get.mockResolvedValue('invalid json');
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(wordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(result).toEqual({ ...wordDefinition, fromCache: false });
    });
  });

  describe('clearWordCache', () => {
    it('should clear word cache successfully', async () => {
      const word = 'hello';
      mockCacheService.delete.mockResolvedValue(undefined);

      const result = await dictionaryService.clearWordCache(word);

      expect(mockCacheService.delete).toHaveBeenCalledWith(`word:${word}`);
      expect(result).toBe(true);
    });

    it('should handle cache delete error', async () => {
      const word = 'hello';
      mockCacheService.delete.mockRejectedValue(new Error('Cache delete error'));

      const result = await dictionaryService.clearWordCache(word);

      expect(mockCacheService.delete).toHaveBeenCalledWith(`word:${word}`);
      expect(result).toBe(false);
    });
  });
});