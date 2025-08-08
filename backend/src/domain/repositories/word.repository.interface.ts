import { Word, Favorite, History } from '@prisma/client';
import { CursorQuery, CursorResponse } from '../../infrastructure/types/word.js';

export interface IWordRepository {
  findMany(query: CursorQuery): Promise<CursorResponse>;
  findById(id: string): Promise<Word | null>;
  findByValue(value: string): Promise<Word | null>;
  create(value: string): Promise<Word>;
  count(search?: string): Promise<number>;
}

export interface IFavoriteRepository {
  findByUserAndWord(userId: string, wordId: string): Promise<Favorite | null>;
  create(userId: string, wordId: string): Promise<Favorite & { word: Word }>;
  upsert(userId: string, wordId: string): Promise<Favorite & { word: Word }>;
  delete(userId: string, wordId: string): Promise<void>;
  findByUser(userId: string): Promise<(Favorite & { word: Word })[]>;
}

export interface IHistoryRepository {
  create(userId: string, wordId: string): Promise<History>;
  findByUser(userId: string): Promise<(History & { word: Word })[]>;
  upsert(userId: string, wordId: string): Promise<History>;
}