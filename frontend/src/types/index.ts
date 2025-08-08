/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ===== BASE TYPES =====

export interface Word {
  id: string;
  value: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// ===== AUTH TYPES =====

export interface AuthSignIn {
  email: string;
  password: string;
}

export interface AuthSignUp {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ===== WORD DEFINITION TYPES =====

export interface License {
  name: string;
  url: string;
}

export interface Phonetic {
  text: string | null;
  audio: string | null;
  sourceUrl?: string;
  license?: License;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordDefinition {
  id: string;
  isFavorite: boolean;
  word: string;
  phonetic: string | null;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: License;
  sourceUrls: string[];
}

// ===== PAGINATION TYPES =====

export interface CursorPaginationResponse<T> {
  results: T[];
  totalDocs: number;
  previous: string | null;
  next: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WordListResponse extends CursorPaginationResponse<Word> {}

// ===== HISTORY & FAVORITES TYPES =====

export interface HistoryItem {
  id: string;
  userId: string;
  wordId: string;
  word?: Word;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  wordId: string;
  word?: Word;
}

export type HistoryResponse = HistoryItem[];
export type FavoritesResponse = FavoriteItem[];

// ===== API RESPONSE TYPES =====

export interface ErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SuccessResponse {
  message: string;
  data?: any;
}

// ===== QUERY TYPES =====

export interface WordQueryParams {
  search?: string;
  limit?: number;
  cursor?: string;
  next?: string;
  previous?: string;
}

export interface PaginationQueryParams {
  limit?: number;
  page?: number;
}

// ===== EXTERNAL API TYPES (Free Dictionary API) =====

export interface RawPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: License;
}

export interface RawDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface RawMeaning {
  partOfSpeech: string;
  definitions: RawDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface RawWordEntry {
  word: string;
  phonetic?: string;
  phonetics?: RawPhonetic[];
  meanings?: RawMeaning[];
  license?: License;
  sourceUrls?: string[];
}

// ===== ADDITIONAL FRONTEND TYPES =====

export interface SearchState {
  query: string;
  isLoading: boolean;
  results: Word[];
  hasMore: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface WordDetailState {
  word: WordDefinition | null;
  isLoading: boolean;
  error: string | null;
}

export interface FavoritesState {
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
}

export interface HistoryState {
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
}

// ===== FORM TYPES =====

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SearchFormData {
  query: string;
}

// ===== COMPONENT PROPS TYPES =====

export interface WordCardProps {
  word: Word;
  isFavorite?: boolean;
  onFavoriteToggle?: (wordId: string) => void;
  onClick?: (word: Word) => void;
}

export interface PaginationProps {
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}