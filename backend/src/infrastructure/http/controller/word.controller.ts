import { DictionaryService } from "@/application/dictionary.service.js";
import prisma from "@/infrastructure/database/prisma.js";
import { CursorQuery, CursorResponse } from "@/infrastructure/types/word.js";
import { Prisma } from "@prisma/client";
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from "fastify";

export class WordController {
    static getWordsList = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { search = "", limit = 50, next, previous } = request.query as CursorQuery;
            const pageSize = Math.min(limit, 100);

            const where: Prisma.WordWhereInput = search
                ? { value: { startsWith: search.toLowerCase(), mode: Prisma.QueryMode.insensitive } }
                : {};

            const orderBy = [{ value: "asc" as const }, { id: "asc" as const }];

            let words: any[] = [];

            if (next) {
                const cursor = await prisma.word.findUnique({ where: { id: next } });
                if (!cursor) return reply.code(400).send({ message: "Invalid next cursor" });

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
                if (!cursor) return reply.code(400).send({ message: "Invalid previous cursor" });

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
                        { value: "desc" },
                        { id: "desc" }
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
            const results = words.slice(0, pageSize);
            const nextCursor = hasNext ? results[results.length - 1].id : null;
            const previousCursor = results.length > 0 ? results[0].id : null;

            const totalDocs = await prisma.word.count({ where });

            const response: CursorResponse = {
                results,
                totalDocs,
                previous: previousCursor,
                next: nextCursor,
                hasNext,
                hasPrev: !!previous,
            };

            return reply.send(response);

        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };


    static getWord = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            const { wordId } = request.params as { wordId: string };

            const dbWord = await prisma.word.findUnique({ where: { id: wordId } });
            if (!dbWord) {
                return reply.code(404).send({ message: "Word not found" });
            }

            const result = await DictionaryService.searchWord(dbWord.value);

            if (!result) {
                return reply.code(404).send({ message: "Word not found in dictionary" });
            }

            await prisma.history.upsert({
                where: {
                    userId_wordId: {
                        userId,
                        wordId: dbWord.id,
                    },
                },
                update: {},
                create: {
                    userId,
                    wordId: dbWord.id,
                },
            });

            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_wordId: {
                        userId,
                        wordId: dbWord.id,
                    },
                },
            });

            return reply
                .header("x-cache", result.fromCache ? "HIT" : "MISS")
                .send({
                    ...result,
                    id: dbWord.id,
                    isFavorite: !!favorite
                });

        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };
}