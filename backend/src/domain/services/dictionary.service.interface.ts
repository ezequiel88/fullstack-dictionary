import { DictionaryResponse } from '../../infrastructure/types/dictionary.js';

export interface IDictionaryService {
  getWordDefinition(word: string): Promise<DictionaryResponse | null>;
}