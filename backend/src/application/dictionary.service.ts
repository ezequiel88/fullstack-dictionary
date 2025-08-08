import { IDictionaryService } from '../domain/services/dictionary.service.interface.js';
import { ICacheService } from '../domain/services/cache.service.interface.js';
import { DictionaryResponse } from '../infrastructure/types/dictionary.js';
import { normalizeDictionaryEntries } from '../infrastructure/utils/normalizeDictionaryEntries.js';

export interface SearchWordResult {
  word: any;
  fromCache: boolean;
}

export class DictionaryService {
  constructor(
    private externalDictionaryService: IDictionaryService,
    private cacheService: ICacheService
  ) { }

  async getWordDictionary(word: string): Promise<DictionaryResponse | null> {
    try {
      return await this.externalDictionaryService.getWordDefinition(word);
    } catch (error) {
      console.error('Error fetching word dictionary:', error);
      throw error;
    }
  }

  async searchWord(word: string): Promise<SearchWordResult | null> {
    const cacheKey = `dictionary:word:${word.toLowerCase()}`;

    // Try to get from cache first
    try {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        try {
          return {
            word: JSON.parse(cached),
            fromCache: true
          };
        } catch (parseError) {
          // Invalid JSON in cache, continue to fetch from external API
          console.warn('Invalid JSON in cache for word:', word);
        }
      }
    } catch (cacheError) {
      // Cache error, continue to fetch from external API
      console.warn('Cache get error for word:', word, cacheError);
    }

    // Fetch from external API
    const wordDictionary = await this.getWordDictionary(word);
    if (!wordDictionary) {
      return null;
    }

    // Normalize the data
    const wordNormalized = normalizeDictionaryEntries(wordDictionary);

    // Cache the result
    try {
      await this.cacheService.set(
        cacheKey,
        JSON.stringify(wordNormalized),
        3600 // 1 hora
      );
    } catch (cacheError) {
      // Cache set error, continue without caching
      console.warn('Cache set error for word:', word, cacheError);
    }

    return {
      word: wordNormalized,
      fromCache: false
    };
  }

  async clearWordCache(word: string): Promise<boolean> {
    const cacheKey = `dictionary:word:${word.toLowerCase()}`;
    try {
      await this.cacheService.delete(cacheKey);
      return true;
    } catch (error) {
      console.warn('Cache delete error for word:', word, error);
      return false;
    }
  }
}