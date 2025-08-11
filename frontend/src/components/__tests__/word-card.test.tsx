import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WordCard from '../word-card'
import { WordDefinition } from '@/types'

describe('WordCard', () => {
  const mockWord: WordDefinition = {
    id: 'test-id',
    isFavorite: false,
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
            example: 'This is a test example',
            synonyms: ['exam', 'trial'],
            antonyms: [],
          },
        ],
        synonyms: ['examination'],
        antonyms: [],
      },
      {
        partOfSpeech: 'verb',
        definitions: [
          {
            definition: 'To test something',
            synonyms: [],
            antonyms: [],
          },
        ],
        synonyms: [],
        antonyms: [],
      },
    ],
    sourceUrls: ['https://example.com'],
  }

  const mockOnToggleFavorite = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render empty state when no word is provided', () => {
    render(<WordCard word={null} onToggleFavorite={mockOnToggleFavorite} />)
    
    expect(screen.getByText(/Selecione uma palavra para ver seu significado/)).toBeInTheDocument()
  })

  it('should render word information correctly', () => {
    render(<WordCard word={mockWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('test')
    // Verificar se a fonética aparece (usando getAllByText para lidar com múltiplas ocorrências)
    const phoneticElements = screen.getAllByText('/test/')
    expect(phoneticElements.length).toBeGreaterThan(0)
    expect(screen.getByText('A test definition')).toBeInTheDocument()
    expect(screen.getByText('This is a test example')).toBeInTheDocument()
  })

  it('should show favorite button as unfilled when not favorite', () => {
    render(<WordCard word={mockWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    const heartIcon = screen.getByTestId('heart-icon')
    expect(heartIcon).toBeInTheDocument()
    expect(heartIcon).toHaveAttribute('fill', 'none')
  })

  it('should show favorite button as filled when favorite', () => {
    const favoriteWord = { ...mockWord, isFavorite: true }
    render(<WordCard word={favoriteWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    const heartIcon = screen.getByTestId('heart-icon')
    expect(heartIcon).toBeInTheDocument()
    expect(heartIcon).toHaveAttribute('fill', 'red')
  })

  it('should call onToggleFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup()
    render(<WordCard word={mockWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    // Buscar o botão que contém o ícone do coração
    const favoriteButton = screen.getAllByRole('button').find(button => 
      button.querySelector('[data-testid="heart-icon"]')
    )
    
    expect(favoriteButton).toBeDefined()
    if (favoriteButton) {
      await user.click(favoriteButton)
      expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockWord)
    }
  })

  it('should navigate between meanings', async () => {
    const user = userEvent.setup()
    render(<WordCard word={mockWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    // Inicialmente deve mostrar o primeiro significado (noun)
    expect(screen.getByText('noun')).toBeInTheDocument()
    expect(screen.getByText('A test definition')).toBeInTheDocument()
    
    // Buscar o botão de próximo (ArrowRight)
    const nextButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg.lucide-arrow-right')
    )
    
    expect(nextButton).toBeDefined()
    if (nextButton) {
      await user.click(nextButton)
      
      // Deve mostrar o segundo significado (verb)
      expect(screen.getByText('verb')).toBeInTheDocument()
      expect(screen.getByText('To test something')).toBeInTheDocument()
      
      // Buscar o botão de anterior (ArrowLeft)
      const prevButton = screen.getAllByRole('button').find(button => 
        button.querySelector('svg.lucide-arrow-left')
      )
      
      expect(prevButton).toBeDefined()
      if (prevButton) {
        await user.click(prevButton)
        
        // Deve voltar ao primeiro significado
        expect(screen.getByText('noun')).toBeInTheDocument()
        expect(screen.getByText('A test definition')).toBeInTheDocument()
      }
    }
  })

  it('should show synonyms when available', () => {
    render(<WordCard word={mockWord} onToggleFavorite={mockOnToggleFavorite} />)
    
    expect(screen.getByText('Sinônimos')).toBeInTheDocument()
    expect(screen.getByText('examination')).toBeInTheDocument()
  })

  it('should handle word without phonetics', () => {
    const wordWithoutPhonetics = {
      ...mockWord,
      phonetics: [],
    }
    
    render(<WordCard word={wordWithoutPhonetics} onToggleFavorite={mockOnToggleFavorite} />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('test')
    // Não deve haver botão de play quando não há phonetics com audio
    const playButton = screen.queryAllByRole('button').find(button => 
      button.querySelector('svg.lucide-play')
    )
    expect(playButton).toBeUndefined()
  })

  it('should handle word without meanings', () => {
    const wordWithoutMeanings = {
      ...mockWord,
      meanings: [],
    }
    
    render(<WordCard word={wordWithoutMeanings} onToggleFavorite={mockOnToggleFavorite} />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('test')
    expect(screen.queryByText('noun')).not.toBeInTheDocument()
  })
})