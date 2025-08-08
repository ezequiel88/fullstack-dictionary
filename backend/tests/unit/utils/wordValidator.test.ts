import { isValidWord, filterValidWords, normalizeWord } from '../../../src/infrastructure/utils/wordValidator';

describe('wordValidator', () => {
  describe('isValidWord', () => {
    it('should accept valid simple words', () => {
      expect(isValidWord('hello')).toBe(true);
      expect(isValidWord('world')).toBe(true);
      expect(isValidWord('test')).toBe(true);
      expect(isValidWord('example')).toBe(true);
    });

    it('should accept words with hyphens', () => {
      expect(isValidWord('well-known')).toBe(true);
      expect(isValidWord('self-control')).toBe(true);
      expect(isValidWord('twenty-one')).toBe(true);
    });

    it('should accept words with apostrophes (contractions)', () => {
      expect(isValidWord('don\'t')).toBe(true);
      expect(isValidWord('can\'t')).toBe(true);
      expect(isValidWord('it\'s')).toBe(true);
    });

    it('should accept words with periods (abbreviations)', () => {
      expect(isValidWord('Mr.')).toBe(true);
      expect(isValidWord('etc.')).toBe(true);
    });

    it('should reject words with problematic characters', () => {
      expect(isValidWord('a — and a half')).toBe(false);
      expect(isValidWord('aaron\u2019s beard')).toBe(false); // curly apostrophe
      expect(isValidWord('a\u2019asia')).toBe(false); // curly apostrophe
      expect(isValidWord('à la')).toBe(false); // accent
      expect(isValidWord('café')).toBe(false); // accent
    });

    it('should reject words that are too short', () => {
      expect(isValidWord('a')).toBe(false);
      expect(isValidWord('I')).toBe(false);
      expect(isValidWord('')).toBe(false);
    });

    it('should reject words that are too long', () => {
      const longWord = 'a'.repeat(51);
      expect(isValidWord(longWord)).toBe(false);
    });

    it('should reject words with too much punctuation', () => {
      expect(isValidWord('...')).toBe(false);
      expect(isValidWord('---')).toBe(false);
      expect(isValidWord('a...')).toBe(false);
      expect(isValidWord('...a')).toBe(false);
    });

    it('should reject words starting with hyphens/periods but allow ending with periods', () => {
      expect(isValidWord('-word')).toBe(false);
      expect(isValidWord('word-')).toBe(false);
      expect(isValidWord('.word')).toBe(false);
      expect(isValidWord('word.')).toBe(true); // Allow abbreviations
    });

    it('should reject words with multiple consecutive punctuation', () => {
      expect(isValidWord('word--test')).toBe(false);
      expect(isValidWord('word..test')).toBe(false);
      expect(isValidWord("word''test")).toBe(false);
    });

    it('should reject complex abbreviations', () => {
      expect(isValidWord('a.b.c.')).toBe(false);
      expect(isValidWord('U.S.A.')).toBe(false);
    });

    it('should reject null, undefined, or non-string values', () => {
      expect(isValidWord(null as any)).toBe(false);
      expect(isValidWord(undefined as any)).toBe(false);
      expect(isValidWord(123 as any)).toBe(false);
      expect(isValidWord({} as any)).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      expect(isValidWord('  hello  ')).toBe(true);
      expect(isValidWord('   ')).toBe(false);
    });
  });

  describe('filterValidWords', () => {
    it('should filter out invalid words from an array', () => {
      const words = [
        'hello',
        'a — and a half',
        'world',
        'aaron\u2019s beard',
        'test',
        'à la',
        'example'
      ];

      const result = filterValidWords(words);
      expect(result).toEqual(['hello', 'world', 'test', 'example']);
    });

    it('should return empty array for all invalid words', () => {
      const words = ['a', '—', 'café', '...'];
      const result = filterValidWords(words);
      expect(result).toEqual([]);
    });

    it('should return all words if all are valid', () => {
      const words = ['hello', 'world', 'test'];
      const result = filterValidWords(words);
      expect(result).toEqual(words);
    });
  });

  describe('normalizeWord', () => {
    it('should convert to lowercase and trim', () => {
      expect(normalizeWord('  HELLO  ')).toBe('hello');
      expect(normalizeWord('World')).toBe('world');
      expect(normalizeWord('TEST')).toBe('test');
    });
  });
});