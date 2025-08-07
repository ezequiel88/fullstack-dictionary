import prisma from "@/infrastructure/database/prisma.js";
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from "fastify";

export class UserController {
    static getProfile = async (request: FastifyCustomRequest, reply: FastifyReply) => {
        try {
            const userId = request.user.id;
            if (!userId) {
                return reply.code(401).send({ error: "Unauthorized" });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return reply.code(404).send({ error: "User not found" });
            }

            return reply.send(user);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal server error" });
        }
    };


    static getHistory = async (request: FastifyCustomRequest, reply: FastifyReply) => {
        try {
            const history = await prisma.history.findMany({
                where: { userId: request.user.id }
            });

            return reply.send(history);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal server error" });
        }
    };

    static getFavorites = async (request: FastifyCustomRequest, reply: FastifyReply) => {
        try {
            const favorites = await prisma.favorite.findMany({
                where: { userId: request.user.id }
            });

            return reply.send(favorites);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal server error" });
        }
    };

    static markFavorite = async (request: FastifyCustomRequest, reply: FastifyReply) => {
        try {
            const user = request.user;
            const { id } = request.params as { id: string };

            const dbWord = await prisma.word.findUnique({ where: { id } });
            if (!dbWord) {
                return reply.code(404).send({ error: "Word not found" });
            }

            const favorite = await prisma.favorite.upsert({
                where: {
                    userId_wordId: { userId: user.id, wordId: dbWord.id },
                },
                update: {},
                create: {
                    user: { connect: { id: user.id } },
                    word: { connect: { id: dbWord.id } },
                },
                include: { word: true },
            });

            return reply.send({
                id: favorite.id,
                word: {
                    id: favorite.word.id,
                    value: favorite.word.value,
                }
            });
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal server error" });
        }
    };

    static unmarkFavorite = async (request: FastifyCustomRequest, reply: FastifyReply) => {
        try {
            const user = request.user;
            const { id } = request.params as { id: string };

            const dbWord = await prisma.word.findUnique({ where: { id } });
            if (!dbWord) {
                return reply.code(404).send({ error: "Word not found" });
            }

            await prisma.favorite.deleteMany({
                where: { userId: user.id, wordId: dbWord.id }
            });

            return reply.code(204).send();
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal server error" });
        }
    };
}