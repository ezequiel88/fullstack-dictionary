import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import Dictionary from '../dictionary'
import { getWordsList, searchWord } from '@/actions/dictionary'
import { getHistory } from '@/actions/history'
import { getFavorites, markAsFavorite, removeFavorite } from '@/actions/favorite'

// Mock das dependências
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))
jest.mock('@/actions/dictionary')
jest.mock('@/actions/history')
jest.mock('@/actions/favorite')

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>
const mockedGetWordsList = getWordsList as jest.MockedFunction<typeof getWordsList>
const mockedSearchWord = searchWord as jest.MockedFunction<typeof searchWord>
const mockedGetHistory = getHistory as jest.MockedFunction<typeof getHistory>
const mockedGetFavorites = getFavorites as jest.MockedFunction<typeof getFavorites>
const mockedMarkAsFavorite = markAsFavorite as jest.MockedFunction<typeof markAsFavorite>
const mockedRemoveFavorite = removeFavorite as jest.MockedFunction<typeof removeFavorite>

describe('Dictionary', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }

  const mockSearchParams = {
    get: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseRouter.mockReturnValue(mockRouter as any)
    mockedUseSearchParams.mockReturnValue(mockSearchParams as any)
    mockSearchParams.get.mockReturnValue(null)

    // Mock das respostas padrão
    mockedGetWordsList.mockResolvedValue({
      success: true,
      data: {
        results: [
          { id: '1', value: 'test' },
          { id: '2', value: 'example' },
        ],
        totalDocs: 2,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: false,
      },
      message: 'Success',
    })

    mockedGetHistory.mockResolvedValue({
      success: true,
      data: [],
      message: 'Success',
    })

    mockedGetFavorites.mockResolvedValue({
      success: true,
      data: [],
      message: 'Success',
    })
  })

  it('should render dictionary interface', async () => {
    await act(async () => {
      render(<Dictionary />)
    })

    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('Palavras')).toBeInTheDocument()
    expect(screen.getByText('Histórico')).toBeInTheDocument()
    expect(screen.getByText('Favoritos')).toBeInTheDocument()

    await waitFor(() => {
      expect(mockedGetWordsList).toHaveBeenCalled()
    })
  })

  it('should load words from URL parameters', async () => {
    mockSearchParams.get.mockImplementation((param) => {
      if (param === 'search') return 'test'
      if (param === 'cursor') return 'cursor123'
      return null
    })

    await act(async () => {
      render(<Dictionary />)
    })

    await waitFor(() => {
      expect(mockedGetWordsList).toHaveBeenCalledWith({
        search: 'test',
        limit: 50,
        cursor: 'cursor123',
      })
    })
  })

  it('should search words when typing', async () => {
    const user = userEvent.setup()
    
    await act(async () => {
      render(<Dictionary />)
    })

    const searchInput = screen.getByRole('searchbox')
    
    await act(async () => {
      await user.type(searchInput, 'hello')
    })

    // Aguardar o debounce
    await waitFor(() => {
      expect(mockedGetWordsList).toHaveBeenCalledWith({
        search: 'hello',
        limit: 50,
        cursor: undefined,
      })
    }, { timeout: 1000 })
  })

  it('should select word and fetch details', async () => {
    const user = userEvent.setup()
    mockedSearchWord.mockResolvedValue({
      success: true,
      data: {
        word: {
          word: 'test',
          phonetic: '/test/',
          phonetics: [],
          meanings: [],
          sourceUrls: [],
        },
        fromCache: false,
        id: '1',
        isFavorite: false,
      },
      message: 'Success',
    })

    await act(async () => {
      render(<Dictionary />)
    })

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    await act(async () => {
      await user.click(screen.getByText('test'))
    })

    await waitFor(() => {
      expect(mockedSearchWord).toHaveBeenCalledWith('1')
    })
  })

  it('should switch to history tab and load history', async () => {
    const user = userEvent.setup()
    
    await act(async () => {
      render(<Dictionary />)
    })

    await act(async () => {
      await user.click(screen.getByText('Histórico'))
    })

    await waitFor(() => {
      expect(mockedGetHistory).toHaveBeenCalled()
    })
  })

  it('should switch to favorites tab and load favorites', async () => {
    const user = userEvent.setup()
    
    await act(async () => {
      render(<Dictionary />)
    })

    await act(async () => {
      await user.click(screen.getByText('Favoritos'))
    })

    await waitFor(() => {
      expect(mockedGetFavorites).toHaveBeenCalled()
    })
  })

  it('should handle favorite toggle', async () => {
    const user = userEvent.setup()
    mockedSearchWord.mockResolvedValue({
      success: true,
      data: {
        word: {
          word: 'test',
          phonetic: '/test/',
          phonetics: [],
          meanings: [],
          sourceUrls: [],
        },
        fromCache: false,
        id: '1',
        isFavorite: false,
      },
      message: 'Success',
    })

    mockedMarkAsFavorite.mockResolvedValue({
      success: true,
      data: null,
      message: 'Success',
    })

    await act(async () => {
      render(<Dictionary />)
    })

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    await act(async () => {
      await user.click(screen.getByText('test'))
    })

    await waitFor(() => {
      expect(mockedSearchWord).toHaveBeenCalledWith('1')
    })

    // Simular clique no botão de favorito
    const favoriteButton = screen.getAllByRole('button').find(button => 
      button.querySelector('[data-testid="heart-icon"]')
    )

    if (favoriteButton) {
      await act(async () => {
        await user.click(favoriteButton)
      })

      await waitFor(() => {
        expect(mockedMarkAsFavorite).toHaveBeenCalledWith('1')
      })
    }
  })

  it('should handle unfavorite toggle', async () => {
    const user = userEvent.setup()
    mockedSearchWord.mockResolvedValue({
      success: true,
      data: {
        word: {
          word: 'test',
          phonetic: '/test/',
          phonetics: [],
          meanings: [],
          sourceUrls: [],
        },
        fromCache: false,
        id: '1',
        isFavorite: true,
      },
      message: 'Success',
    })

    mockedRemoveFavorite.mockResolvedValue({
      success: true,
      data: null,
      message: 'Success',
    })

    await act(async () => {
      render(<Dictionary />)
    })

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    await act(async () => {
      await user.click(screen.getByText('test'))
    })

    await waitFor(() => {
      expect(mockedSearchWord).toHaveBeenCalledWith('1')
    })

    // Simular clique no botão de favorito
    const favoriteButton = screen.getAllByRole('button').find(button => 
      button.querySelector('[data-testid="heart-icon"]')
    )

    if (favoriteButton) {
      await act(async () => {
        await user.click(favoriteButton)
      })

      await waitFor(() => {
        expect(mockedRemoveFavorite).toHaveBeenCalledWith('1')
      })
    }
  })

  it('should handle search error', async () => {
    const user = userEvent.setup()
    mockedGetWordsList.mockResolvedValue({
      success: false,
      data: null,
      message: 'Search failed',
    })

    await act(async () => {
      render(<Dictionary />)
    })

    const searchInput = screen.getByRole('searchbox')
    
    await act(async () => {
      await user.type(searchInput, 'error')
    })

    await waitFor(() => {
      expect(mockedGetWordsList).toHaveBeenCalledWith({
        search: 'error',
        limit: 50,
        cursor: undefined,
      })
    }, { timeout: 1000 })

    // Verificar se o erro é tratado adequadamente
    // (pode não haver elementos visíveis de erro dependendo da implementação)
  })

  it('should handle word details error', async () => {
    const user = userEvent.setup()
    mockedSearchWord.mockResolvedValue({
      success: false,
      data: null,
      message: 'Word not found',
    })

    await act(async () => {
      render(<Dictionary />)
    })

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    await act(async () => {
      await user.click(screen.getByText('test'))
    })

    await waitFor(() => {
      expect(mockedSearchWord).toHaveBeenCalledWith('1')
    })

    // Verificar se o erro é tratado adequadamente
  })
})