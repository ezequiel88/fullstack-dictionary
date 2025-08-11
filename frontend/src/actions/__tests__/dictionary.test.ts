import { searchWord, getWordsList } from '../dictionary'
import api from '@/lib/api'
import { WordSearchResponse, WordListResponse } from '@/types'

// Mock do módulo api
jest.mock('@/lib/api')
const mockedApi = api as jest.Mocked<typeof api>

describe('dictionary actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchWord', () => {
    const mockWordResponse: WordSearchResponse = {
      word: {
        word: 'test',
        phonetic: '/test/',
        phonetics: [
          {
            text: '/test/',
            audio: 'https://example.com/test.mp3',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'A test definition',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
        ],
        sourceUrls: ['https://example.com'],
      },
      fromCache: false,
      id: 'test-id',
      isFavorite: false,
    }

    it('should search word successfully', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockWordResponse })

      const result = await searchWord('test')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockWordResponse)
      expect(result.message).toBe('Palavra encontrada')
      expect(mockedApi.get).toHaveBeenCalledWith('/entries/en/test')
    })

    it('should handle search word error', async () => {
      const errorMessage = 'Word not found'
      mockedApi.get.mockRejectedValueOnce(new Error(errorMessage))

      const result = await searchWord('nonexistent')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.message).toBe(errorMessage)
    })

    it('should handle search word error without message', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error())

      const result = await searchWord('test')

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.message).toBe('Palavra não encontrada')
    })
  })

  describe('getWordsList', () => {
    const mockWordsListResponse: WordListResponse = {
      results: [
        { id: '1', value: 'test1' },
        { id: '2', value: 'test2' },
      ],
      totalDocs: 2,
      previous: null,
      next: 'cursor123',
      hasNext: true,
      hasPrev: false,
    }

    it('should get words list without parameters', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockWordsListResponse })

      const result = await getWordsList()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockWordsListResponse)
      expect(result.message).toBe('Lista de palavras obtida com sucesso')
      expect(mockedApi.get).toHaveBeenCalledWith('/entries/en')
    })

    it('should get words list with search parameter', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockWordsListResponse })

      const result = await getWordsList({ search: 'test' })

      expect(result.success).toBe(true)
      expect(mockedApi.get).toHaveBeenCalledWith('/entries/en?search=test')
    })

    it('should get words list with all parameters', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: mockWordsListResponse })

      const result = await getWordsList({
        search: 'test',
        limit: 10,
        cursor: 'cursor123',
      })

      expect(result.success).toBe(true)
      expect(mockedApi.get).toHaveBeenCalledWith('/entries/en?search=test&limit=10&next=cursor123')
    })

    it('should handle get words list error', async () => {
      const errorMessage = 'Failed to fetch words'
      mockedApi.get.mockRejectedValueOnce(new Error(errorMessage))

      const result = await getWordsList()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.message).toBe(errorMessage)
    })

    it('should handle get words list error without message', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error())

      const result = await getWordsList()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.message).toBe('Erro ao obter lista de palavras')
    })
  })
})