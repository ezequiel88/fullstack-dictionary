// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  
  // User
  USER_PROFILE: '/user/me',
  USER_HISTORY: '/user/me/history',
  USER_FAVORITES: '/user/me/favorites',
  
  // Words
  WORDS_LIST: '/entries/en',
  WORD_DETAIL: (wordId: string) => `/entries/en/${wordId}`,
  
  // Favorites
  MARK_FAVORITE: (wordId: string) => `/user/me/${wordId}/favorite`,
  UNMARK_FAVORITE: (wordId: string) => `/user/me/${wordId}/unfavorite`,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

// Default pagination values
export const PAGINATION_DEFAULTS = {
  LIMIT: 20,
  PAGE: 1,
} as const;

// API Headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
} as const;