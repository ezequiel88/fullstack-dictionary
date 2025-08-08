/**
 * Utility functions for validating and filtering words
 */

/**
 * Validates if a word is well-formed and suitable for the dictionary
 * @param word - The word to validate
 * @returns true if the word is valid, false otherwise
 */
export function isValidWord(word: string): boolean {
  if (!word || typeof word !== 'string') {
    return false;
  }

  const trimmedWord = word.trim();

  // Check minimum length (at least 2 characters)
  if (trimmedWord.length < 2) {
    return false;
  }

  // Check maximum reasonable length (avoid extremely long entries)
  if (trimmedWord.length > 50) {
    return false;
  }

  // Check for problematic characters (curly quotes, em dashes, etc.)
  // Note: straight apostrophes (') are allowed for contractions
  const problematicChars = /[—""…\u2013\u2014\u2018\u2019\u201C\u201D\u2026]/;
  if (problematicChars.test(trimmedWord)) {
    return false;
  }

  // Check for non-ASCII characters (accents, special symbols)
  // Allow only basic Latin letters, hyphens, straight apostrophes, and periods
  const validCharsPattern = /^[a-zA-Z\-'.]+$/;
  if (!validCharsPattern.test(trimmedWord)) {
    return false;
  }

  // Reject words that are mostly punctuation
  const letterCount = (trimmedWord.match(/[a-zA-Z]/g) || []).length;
  
  // At least 50% of the word should be letters (more lenient for contractions)
  if (letterCount / trimmedWord.length < 0.5) {
    return false;
  }

  // Reject words with too many consecutive punctuation marks
  if (/[\-'.]{3,}/.test(trimmedWord)) {
    return false;
  }

  // Reject words starting with punctuation (except apostrophes for contractions)
  if (/^[\-.]/.test(trimmedWord)) {
    return false;
  }
  
  // Allow words ending with periods (abbreviations) but not hyphens
  if (/\-$/.test(trimmedWord)) {
    return false;
  }

  // Reject words with multiple consecutive hyphens, periods, or apostrophes
  if (/--+|\.\.+|''+/.test(trimmedWord)) {
    return false;
  }

  // Reject words that look like abbreviations with multiple periods
  if (/\.[a-zA-Z]\.|[a-zA-Z]\.[a-zA-Z]\./.test(trimmedWord)) {
    return false;
  }

  return true;
}

/**
 * Filters an array of words, keeping only valid ones
 * @param words - Array of words to filter
 * @returns Array of valid words
 */
export function filterValidWords(words: string[]): string[] {
  return words.filter(isValidWord);
}

/**
 * Normalizes a word for database storage
 * @param word - The word to normalize
 * @returns Normalized word in lowercase
 */
export function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}