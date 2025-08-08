import { DictionaryService } from '../../../src/application/dictionary.service.js';
import { IDictionaryService } from '../../../src/domain/services/dictionary.service.interface.js';
import { ICacheService } from '../../../src/domain/services/cache.service.interface.js';
import { WordEntry } from '../../../src/infrastructure/types/dictionary.js';

describe('DictionaryService', () => {
  let dictionaryService: DictionaryService;
  let mockExternalDictionaryService: jest.Mocked<IDictionaryService>;
  let mockCacheService: jest.Mocked<ICacheService>;
  let consoleWarnSpy: jest.SpyInstance;

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

    // Mock console.warn to suppress expected warning messages during tests
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    dictionaryService = new DictionaryService(mockExternalDictionaryService, mockCacheService);
  });

  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  describe('searchWord', () => {
    const word = 'hello';
    const rawWordDefinition = [{
      word: 'hello',
      phonetics: [{ text: '/həˈloʊ/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [{ definition: 'A greeting' }],
        },
      ],
    }];
    
    const normalizedWordDefinition = [{
      word: 'hello',
      phonetic: null,
      phonetics: [{ text: '/həˈloʊ/', audio: null, sourceUrl: undefined, license: undefined }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [{ definition: 'A greeting', example: undefined, synonyms: [], antonyms: [] }],
          synonyms: [],
          antonyms: [],
        },
      ],
      license: undefined,
      sourceUrls: [],
    }];

    it('should return cached result when available', async () => {
      const cachedResult = { word: normalizedWordDefinition, fromCache: true };
      mockCacheService.get.mockResolvedValue(JSON.stringify(normalizedWordDefinition));

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`dictionary:word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResult);
    });

    it('should fetch from external service when not cached', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(rawWordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`dictionary:word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `dictionary:word:${word}`,
        JSON.stringify(normalizedWordDefinition),
        3600
      );
      expect(result).toEqual({ word: normalizedWordDefinition, fromCache: false });
    });

    it('should return null when word not found', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(null);

      const result = await dictionaryService.searchWord(word);

      expect(mockCacheService.get).toHaveBeenCalledWith(`dictionary:word:${word}`);
      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(mockCacheService.set).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle cache get error gracefully', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Cache error'));
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(rawWordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(result).toEqual({ word: normalizedWordDefinition, fromCache: false });
      expect(consoleWarnSpy).toHaveBeenCalledWith('Cache get error for word:', word, expect.any(Error));
    });

    it('should handle cache set error gracefully', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockCacheService.set.mockRejectedValue(new Error('Cache set error'));
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(rawWordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(result).toEqual({ word: normalizedWordDefinition, fromCache: false });
      expect(consoleWarnSpy).toHaveBeenCalledWith('Cache set error for word:', word, expect.any(Error));
    });

    it('should handle invalid cached JSON gracefully', async () => {
      mockCacheService.get.mockResolvedValue('invalid json');
      mockExternalDictionaryService.getWordDefinition.mockResolvedValue(rawWordDefinition as any);

      const result = await dictionaryService.searchWord(word);

      expect(mockExternalDictionaryService.getWordDefinition).toHaveBeenCalledWith(word);
      expect(result).toEqual({ word: normalizedWordDefinition, fromCache: false });
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid JSON in cache for word:', word);
    });
  });

  describe('clearWordCache', () => {
    it('should clear word cache successfully', async () => {
      const word = 'hello';
      mockCacheService.delete.mockResolvedValue(undefined);

      const result = await dictionaryService.clearWordCache(word);

      expect(mockCacheService.delete).toHaveBeenCalledWith(`dictionary:word:${word}`);
      expect(result).toBe(true);
    });

    it('should handle cache delete error', async () => {
      const word = 'hello';
      mockCacheService.delete.mockRejectedValue(new Error('Cache delete error'));

      const result = await dictionaryService.clearWordCache(word);

      expect(mockCacheService.delete).toHaveBeenCalledWith(`dictionary:word:${word}`);
      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Cache delete error for word:', word, expect.any(Error));
    });
  });
});