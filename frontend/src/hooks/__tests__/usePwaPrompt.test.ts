import { renderHook, act } from '@testing-library/react'
import { usePwaPrompt } from '../usePwaPrompt'

// Mock window.matchMedia
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

describe('usePwaPrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePwaPrompt())

    expect(result.current.canInstall).toBe(false)
    expect(result.current.isInstalled).toBe(false)
    expect(typeof result.current.promptToInstall).toBe('function')
  })

  it('should detect if app is already installed', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(display-mode: standalone)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    const { result } = renderHook(() => usePwaPrompt())

    expect(result.current.isInstalled).toBe(true)
    expect(result.current.canInstall).toBe(false)
  })

  it('should handle beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePwaPrompt())

    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    }

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), mockEvent)
      )
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(result.current.canInstall).toBe(true)
  })

  it('should handle appinstalled event', () => {
    const { result } = renderHook(() => usePwaPrompt())

    // Primeiro simular o beforeinstallprompt
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    }

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), mockEvent)
      )
    })

    expect(result.current.canInstall).toBe(true)

    // Agora simular a instalação
    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })

    expect(result.current.isInstalled).toBe(true)
    expect(result.current.canInstall).toBe(false)
  })

  it('should prompt to install when called', async () => {
    const { result } = renderHook(() => usePwaPrompt())

    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    }

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), mockEvent)
      )
    })

    await act(async () => {
      await result.current.promptToInstall()
    })

    expect(mockEvent.prompt).toHaveBeenCalled()
    expect(result.current.canInstall).toBe(false)
  })

  it('should handle dismissed install prompt', async () => {
    const { result } = renderHook(() => usePwaPrompt())

    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
    }

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), mockEvent)
      )
    })

    await act(async () => {
      await result.current.promptToInstall()
    })

    expect(mockEvent.prompt).toHaveBeenCalled()
    // canInstall deve permanecer true quando dismissed
    expect(result.current.canInstall).toBe(true)
  })

  it('should not prompt when no deferred prompt available', async () => {
    const { result } = renderHook(() => usePwaPrompt())

    await act(async () => {
      await result.current.promptToInstall()
    })

    // Não deve fazer nada se não há prompt disponível
    expect(result.current.canInstall).toBe(false)
  })
})