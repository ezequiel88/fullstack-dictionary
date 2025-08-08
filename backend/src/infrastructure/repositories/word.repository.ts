import { Word, Favorite, History, Prisma } from '@prisma/client';
import { 
  IWordRepository, 
  IFavoriteRepository, 
  IHistoryRepository 
} from '../../domain/repositories/word.repository.interface.js';
import { CursorQuery, CursorResponse } from '../types/word.js';
import prisma from '../database/prisma.js';

export class WordRepository implements IWordRepository {
  async findMany(query: CursorQuery): Promise<CursorResponse> {
    const { search = '', limit = 50, next, previous } = query;
    const pageSize = Math.min(limit, 100);

    const where: Prisma.WordWhereInput = search
      ? { value: { startsWith: search.toLowerCase(), mode: Prisma.QueryMode.insensitive } }
      : {};

    const orderBy = [{ value: 'asc' as const }, { id: 'asc' as const }];

    let words: Word[] = [];

    if (next) {
      const cursor = await prisma.word.findUnique({ where: { id: next } });
      if (!cursor) throw new Error('Cursor de próxima página inválido');

      words = await prisma.word.findMany({
        where: {
          ...where,
          OR: [
            { value: { gt: cursor.value } },
            { value: cursor.value, id: { gt: cursor.id } }
          ]
        },
        take: pageSize + 1,
        orderBy,
      });
    } else if (previous) {
      const cursor = await prisma.word.findUnique({ where: { id: previous } });
      if (!cursor) throw new Error('Cursor de página anterior inválido');

      words = await prisma.word.findMany({
        where: {
          ...where,
          OR: [
            { value: { lt: cursor.value } },
            { value: cursor.value, id: { lt: cursor.id } }
          ]
        },
        take: pageSize + 1,
        orderBy: [
          { value: 'desc' },
          { id: 'desc' }
        ],
      });

      words.reverse();
    } else {
      words = await prisma.word.findMany({
        where,
        orderBy,
        take: pageSize + 1,
      });
    }


    
    const hasNext = words.length > pageSize;
    const results = hasNext ? words.slice(0, pageSize) : words;
    const nextCursor = hasNext ? results[results.length - 1].id : null;
    const previousCursor = results.length > 0 ? results[0].id : null;

    const totalDocs = await this.count(search);

    return {
      results,
      totalDocs,
      previous: previousCursor,
      next: nextCursor,
      hasNext,
      hasPrev: !!previous,
    };
  }

  async findById(id: string): Promise<Word | null> {
    return prisma.word.findUnique({
      where: { id }
    });
  }

  async findByValue(value: string): Promise<Word | null> {
    return prisma.word.findUnique({
      where: { value: value.toLowerCase() }
    });
  }

  async create(value: string): Promise<Word> {
    return prisma.word.create({
      data: { value: value.toLowerCase() }
    });
  }

  async count(search?: string): Promise<number> {
    const where: Prisma.WordWhereInput = search
      ? { value: { startsWith: search.toLowerCase(), mode: Prisma.QueryMode.insensitive } }
      : {};

    return prisma.word.count({ where });
  }
}

export class FavoriteRepository implements IFavoriteRepository {
  async findByUserAndWord(userId: string, wordId: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        userId_wordId: { userId, wordId }
      }
    });
  }

  async create(userId: string, wordId: string): Promise<Favorite & { word: Word }> {
    return prisma.favorite.create({
      data: {
        user: { connect: { id: userId } },
        word: { connect: { id: wordId } }
      },
      include: { word: true }
    });
  }

  async upsert(userId: string, wordId: string): Promise<Favorite & { word: Word }> {
    return prisma.favorite.upsert({
      where: {
        userId_wordId: { userId, wordId }
      },
      update: {},
      create: {
        user: { connect: { id: userId } },
        word: { connect: { id: wordId } }
      },
      include: { word: true }
    });
  }

  async delete(userId: string, wordId: string): Promise<void> {
    await prisma.favorite.deleteMany({
      where: { userId, wordId }
    });
  }

  async findByUser(userId: string): Promise<(Favorite & { word: Word })[]> {
    return prisma.favorite.findMany({
      where: { userId },
      include: { word: true }
    });
  }
}

export class HistoryRepository implements IHistoryRepository {
  async create(userId: string, wordId: string): Promise<History> {
    return prisma.history.create({
      data: {
        user: { connect: { id: userId } },
        word: { connect: { id: wordId } }
      }
    });
  }

  async findByUser(userId: string): Promise<(History & { word: Word })[]> {
    return prisma.history.findMany({
      where: { userId },
      include: { word: true },
      orderBy: { id: 'desc' }
    });
  }

  async upsert(userId: string, wordId: string): Promise<History> {
    return prisma.history.upsert({
      where: {
        userId_wordId: { userId, wordId }
      },
      update: {},
      create: {
        user: { connect: { id: userId } },
        word: { connect: { id: wordId } }
      }
    });
  }
}