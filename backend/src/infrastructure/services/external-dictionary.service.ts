import { IDictionaryService } from '../../domain/services/dictionary.service.interface.js';
import { DictionaryResponse } from '../types/dictionary.js';
import api from '../lib/api.js';

export class ExternalDictionaryService implements IDictionaryService {
  async getWordDefinition(word: string): Promise<DictionaryResponse | null> {
    try {
      const { data } = await api.get<DictionaryResponse>(`/${word}`);
      return data;
    } catch (error) {
      console.error('External dictionary service error:', error);
      return null;
    }
  }
}