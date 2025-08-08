import {
  AuthSignIn,
  AuthSignUp,
  AuthResponse,
  User,
  WordListResponse,
  WordDefinition,
  HistoryResponse,
  FavoritesResponse,
  WordQueryParams,
} from '@/types';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, HTTP_STATUS, ERROR_MESSAGES } from './api';
import { AuthManager } from './auth';

/**
 * Classe para tratamento de erros da API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Função base para fazer requisições HTTP
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = AuthManager.getToken();

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(token || undefined),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Se a resposta for 204 (No Content), retorna objeto vazio
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Se for erro 401, fazer logout automático
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        AuthManager.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      throw new ApiError(
        data.message || getErrorMessage(response.status),
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Erro de rede ou outro erro
    throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
  }
}

/**
 * Obtém mensagem de erro baseada no status HTTP
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.SERVER_ERROR;
  }
}

/**
 * API de Autenticação
 */
export const authApi = {
  /**
   * Fazer login
   */
  signIn: async (credentials: AuthSignIn): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(API_ENDPOINTS.SIGN_IN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Fazer cadastro
   */
  signUp: async (userData: AuthSignUp): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(API_ENDPOINTS.SIGN_UP, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

/**
 * API de Usuário
 */
export const userApi = {
  /**
   * Obter perfil do usuário
   */
  getProfile: async (): Promise<User> => {
    return fetchApi<User>(API_ENDPOINTS.USER_PROFILE);
  },

  /**
   * Obter histórico do usuário
   */
  getHistory: async (): Promise<HistoryResponse> => {
    return fetchApi<HistoryResponse>(API_ENDPOINTS.USER_HISTORY);
  },

  /**
   * Obter favoritos do usuário
   */
  getFavorites: async (): Promise<FavoritesResponse> => {
    return fetchApi<FavoritesResponse>(API_ENDPOINTS.USER_FAVORITES);
  },
};

/**
 * API de Palavras
 */
export const wordsApi = {
  /**
   * Listar palavras com paginação e busca
   */
  getWords: async (params: WordQueryParams = {}): Promise<WordListResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.next) searchParams.append('next', params.next);
    if (params.previous) searchParams.append('previous', params.previous);

    const endpoint = `${API_ENDPOINTS.WORDS_LIST}?${searchParams.toString()}`;
    return fetchApi<WordListResponse>(endpoint);
  },

  /**
   * Obter detalhes de uma palavra
   */
  getWordDetail: async (wordId: string): Promise<WordDefinition> => {
    return fetchApi<WordDefinition>(API_ENDPOINTS.WORD_DETAIL(wordId));
  },
};

/**
 * API de Favoritos
 */
export const favoritesApi = {
  /**
   * Marcar palavra como favorita
   */
  markFavorite: async (wordId: string): Promise<void> => {
    return fetchApi<void>(API_ENDPOINTS.MARK_FAVORITE(wordId), {
      method: 'POST',
    });
  },

  /**
   * Desmarcar palavra como favorita
   */
  unmarkFavorite: async (wordId: string): Promise<void> => {
    return fetchApi<void>(API_ENDPOINTS.UNMARK_FAVORITE(wordId), {
      method: 'DELETE',
    });
  },
};

/**
 * API Client principal que exporta todas as APIs
 */
export const apiClient = {
  auth: authApi,
  user: userApi,
  words: wordsApi,
  favorites: favoritesApi,
};