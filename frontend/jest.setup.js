import '@testing-library/jest-dom'

// Configure React testing environment for React 19
global.IS_REACT_ACT_ENVIRONMENT = true

// Configuração elegante de logs para testes - similar ao backend
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

// Suprime console.error esperados durante os testes
console.error = (...args) => {
  if (typeof args[0] === 'string') {
    // Suprime avisos do React 19 act()
    if (args[0].includes('The current testing environment is not configured to support act(...)')) {
      return
    }
    
    // Suprime erros específicos dos testes de ações
    if (args[0].includes('Search word error:') || 
        args[0].includes('Get words list error:')) {
      return
    }
    
    // Suprime erros esperados dos testes de dicionário
    if (args[0].includes('Erro ao buscar palavras:') || 
        args[0].includes('Erro ao buscar palavra:')) {
      return
    }
    
    // Suprime erros do Audio API nos testes
    if (args[0].includes('Cannot read properties of undefined (reading \'catch\')') ||
        args[0].includes('TypeError: Cannot read properties of undefined (reading \'catch\')') ||
        args[0].includes('audio.play is not a function')) {
      return
    }
    
    // Suprime outros erros esperados durante os testes
    const expectedErrors = [
      'Search failed',
      'Word not found',
      'Network error',
      'Authentication failed',
      'Registration failed',
      'Failed to fetch words',
      'TypeError: Cannot read properties of undefined',
      'Audio play failed'
    ]
    
    if (expectedErrors.some(error => args[0].includes(error))) {
      return
    }
  }
  
  originalConsoleError.call(console, ...args)
}

// Suprime warnings específicos durante os testes
console.warn = (...args) => {
  if (typeof args[0] === 'string') {
    // Filtra warnings específicos que são esperados nos testes
    const expectedWarnings = [
      'React Router',
      'Next.js',
      'Warning: ReactDOM.render',
      'Warning: componentWillReceiveProps'
    ]
    
    if (expectedWarnings.some(warning => args[0].includes(warning))) {
      return
    }
  }
  
  originalConsoleWarn.call(console, ...args)
}

// Suprime logs desnecessários durante os testes
console.log = (...args) => {
  if (typeof args[0] === 'string') {
    // Filtra mensagens de setup/cleanup dos testes
    if (args[0].includes('Setting up test environment') || 
        args[0].includes('Cleaning up test environment') ||
        args[0].includes('Test setup complete')) {
      return
    }
  }
  
  originalConsoleLog.call(console, ...args)
}

// Restaura console original após todos os testes
afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  console.log = originalConsoleLog
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Next.js themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => children,
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock Audio API - Versão simplificada e mais robusta
global.Audio = jest.fn().mockImplementation((src) => {
  const mockAudio = {
    src: src,
    onended: null,
    onerror: null,
    onloadstart: null,
    onloadeddata: null,
    currentTime: 0,
    duration: 0,
    paused: true,
    volume: 1,
    muted: false,
    
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockImplementation(function() {
      this.paused = true
    }),
    
    addEventListener: jest.fn().mockImplementation(function(event, handler) {
      if (event === 'ended') {
        this.onended = handler
      } else if (event === 'error') {
        this.onerror = handler
      }
    }),
    
    removeEventListener: jest.fn().mockImplementation(function(event, handler) {
      if (event === 'ended') {
        this.onended = null
      } else if (event === 'error') {
        this.onerror = null
      }
    })
  }
  
  // Ensure play method is always a function that returns a resolved promise
  mockAudio.play.mockImplementation(function() {
    this.paused = false
    return Promise.resolve()
  }.bind(mockAudio))
  
  return mockAudio
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver - Corrigido
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.elements = new Set()
  }

  observe(element) {
    this.elements.add(element)
    // Simula que o elemento está visível
    this.callback([{
      target: element,
      isIntersecting: false, // Por padrão não intersecta para evitar carregamentos automáticos nos testes
      intersectionRatio: 0,
      boundingClientRect: {},
      intersectionRect: {},
      rootBounds: {},
      time: Date.now()
    }])
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }
}

global.IntersectionObserver = MockIntersectionObserver

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback
    this.elements = new Set()
  }

  observe(element) {
    this.elements.add(element)
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }
}

global.ResizeObserver = MockResizeObserver