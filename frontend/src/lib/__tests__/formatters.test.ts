import {
  normalizeWordDefinition,
  formatDate,
  formatRelativeDate,
  capitalize,
  truncateText,
  sanitizeSearchTerm,
  isValidAudioUrl,
  getFirstValidAudio,
  getAllDefinitions,
  getAllSynonyms,
  getAllAntonyms,
  formatWordList,
} from '../formatters'
import { RawWordEntry, Phonetic, Meaning } from '@/types'

describe('formatters', () => {
  describe('normalizeWordDefinition', () => {
    const mockRawData: RawWordEntry[] = [
      {
        word: 'test',
        phonetic: '/test/',
        phonetics: [
          { text: '/test/', audio: 'test.mp3' },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'A test definition',
                example: 'This is a test',
                synonyms: ['exam'],
                antonyms: [],
              },
            ],
            synonyms: ['examination'],
            antonyms: [],
          },
        ],
        sourceUrls: ['https://example.com'],
      },
    ]

    it('should normalize word definition correctly', () => {
      const result = normalizeWordDefinition(mockRawData, 'test-id', true)

      expect(result).toEqual({
        id: 'test-id',
        isFavorite: true,
        word: 'test',
        phonetic: '/test/',
        phonetics: [
          { text: '/test/', audio: 'test.mp3', sourceUrl: undefined, license: undefined },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'A test definition',
                example: 'This is a test',
                synonyms: ['exam'],
                antonyms: [],
              },
            ],
            synonyms: ['examination'],
            antonyms: [],
          },
        ],
        license: undefined,
        sourceUrls: ['https://example.com'],
      })
    })

    it('should return null for empty data', () => {
      expect(normalizeWordDefinition([], 'test-id')).toBeNull()
      expect(normalizeWordDefinition(null as any, 'test-id')).toBeNull()
    })

    it('should handle missing phonetic data', () => {
      const dataWithoutPhonetic = [{ ...mockRawData[0], phonetic: undefined }]
      const result = normalizeWordDefinition(dataWithoutPhonetic, 'test-id')
      expect(result?.phonetic).toBeNull()
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2023-12-25T10:30:00Z'
      const result = formatDate(date)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/)
    })
  })

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-12-25T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return "agora" for very recent dates', () => {
      const date = new Date('2023-12-25T11:59:30Z').toISOString()
      expect(formatRelativeDate(date)).toBe('agora')
    })

    it('should return minutes for recent dates', () => {
      const date = new Date('2023-12-25T11:45:00Z').toISOString()
      expect(formatRelativeDate(date)).toBe('há 15 minutos')
    })

    it('should return hours for dates within 24 hours', () => {
      const date = new Date('2023-12-25T10:00:00Z').toISOString()
      expect(formatRelativeDate(date)).toBe('há 2 horas')
    })

    it('should return days for dates within a week', () => {
      const date = new Date('2023-12-23T12:00:00Z').toISOString()
      expect(formatRelativeDate(date)).toBe('há 2 dias')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('HELLO')).toBe('Hello')
      expect(capitalize('hELLO')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('truncateText', () => {
    it('should truncate text when longer than maxLength', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...')
    })

    it('should return original text when shorter than maxLength', () => {
      expect(truncateText('Short', 10)).toBe('Short')
    })

    it('should handle exact length', () => {
      expect(truncateText('Exactly10!', 10)).toBe('Exactly10!')
    })
  })

  describe('sanitizeSearchTerm', () => {
    it('should remove special characters and normalize', () => {
      expect(sanitizeSearchTerm('Hello@#$%World!')).toBe('helloworld')
    })

    it('should preserve hyphens and apostrophes', () => {
      expect(sanitizeSearchTerm("don't-worry")).toBe("don't-worry")
    })

    it('should normalize whitespace', () => {
      expect(sanitizeSearchTerm('  hello   world  ')).toBe('hello world')
    })
  })

  describe('isValidAudioUrl', () => {
    it('should return true for valid audio URLs', () => {
      expect(isValidAudioUrl('https://example.com/audio.mp3')).toBe(true)
      expect(isValidAudioUrl('https://example.com/audio.wav')).toBe(true)
      expect(isValidAudioUrl('https://example.com/audio.ogg')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isValidAudioUrl('not-a-url')).toBe(false)
      expect(isValidAudioUrl('https://example.com/image.jpg')).toBe(false)
      expect(isValidAudioUrl(null)).toBe(false)
      expect(isValidAudioUrl('')).toBe(false)
    })
  })

  describe('getFirstValidAudio', () => {
    const phonetics: Phonetic[] = [
      { text: '/test1/', audio: null },
      { text: '/test2/', audio: 'invalid-url' },
      { text: '/test3/', audio: 'https://example.com/audio.mp3' },
      { text: '/test4/', audio: 'https://example.com/audio2.wav' },
    ]

    it('should return first valid audio URL', () => {
      expect(getFirstValidAudio(phonetics)).toBe('https://example.com/audio.mp3')
    })

    it('should return null when no valid audio found', () => {
      const invalidPhonetics = phonetics.slice(0, 2)
      expect(getFirstValidAudio(invalidPhonetics)).toBeNull()
    })

    it('should handle empty array', () => {
      expect(getFirstValidAudio([])).toBeNull()
    })
  })

  describe('getAllDefinitions', () => {
    const meanings: Meaning[] = [
      {
        partOfSpeech: 'noun',
        definitions: [
          { definition: 'def1', synonyms: [], antonyms: [] },
          { definition: 'def2', synonyms: [], antonyms: [] },
        ],
        synonyms: [],
        antonyms: [],
      },
      {
        partOfSpeech: 'verb',
        definitions: [
          { definition: 'def3', synonyms: [], antonyms: [] },
        ],
        synonyms: [],
        antonyms: [],
      },
    ]

    it('should extract all definitions from all meanings', () => {
      const result = getAllDefinitions(meanings)
      expect(result).toHaveLength(3)
      expect(result.map(d => d.definition)).toEqual(['def1', 'def2', 'def3'])
    })

    it('should handle empty meanings', () => {
      expect(getAllDefinitions([])).toEqual([])
    })
  })

  describe('getAllSynonyms', () => {
    const meanings: Meaning[] = [
      {
        partOfSpeech: 'noun',
        definitions: [
          { definition: 'def1', synonyms: ['syn1', 'syn2'], antonyms: [] },
        ],
        synonyms: ['syn3'],
        antonyms: [],
      },
      {
        partOfSpeech: 'verb',
        definitions: [
          { definition: 'def2', synonyms: ['syn1', 'syn4'], antonyms: [] },
        ],
        synonyms: ['syn5'],
        antonyms: [],
      },
    ]

    it('should extract unique synonyms from all sources', () => {
      const result = getAllSynonyms(meanings)
      expect(result.sort()).toEqual(['syn1', 'syn2', 'syn3', 'syn4', 'syn5'])
    })

    it('should handle empty meanings', () => {
      expect(getAllSynonyms([])).toEqual([])
    })
  })

  describe('getAllAntonyms', () => {
    const meanings: Meaning[] = [
      {
        partOfSpeech: 'noun',
        definitions: [
          { definition: 'def1', synonyms: [], antonyms: ['ant1', 'ant2'] },
        ],
        synonyms: [],
        antonyms: ['ant3'],
      },
    ]

    it('should extract unique antonyms from all sources', () => {
      const result = getAllAntonyms(meanings)
      expect(result.sort()).toEqual(['ant1', 'ant2', 'ant3'])
    })

    it('should handle empty meanings', () => {
      expect(getAllAntonyms([])).toEqual([])
    })
  })

  describe('formatWordList', () => {
    it('should handle empty array', () => {
      expect(formatWordList([])).toBe('')
    })

    it('should handle single word', () => {
      expect(formatWordList(['word'])).toBe('word')
    })

    it('should handle two words', () => {
      expect(formatWordList(['word1', 'word2'])).toBe('word1 e word2')
    })

    it('should handle multiple words', () => {
      expect(formatWordList(['word1', 'word2', 'word3', 'word4']))
        .toBe('word1, word2, word3 e word4')
    })
  })
})