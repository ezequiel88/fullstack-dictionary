import prisma from "@/infrastructure/database/prisma.js";
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from "fastify";

export class UserController {
    static getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            if (!userId) {
                return reply.code(401).send({ message: "Unauthorized" });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return reply.code(404).send({ message: "User not found" });
            }

            return reply.send(user);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };


    static getHistory = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            const history = await prisma.history.findMany({
                where: { userId }
            });

            return reply.send(history);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };

    static getFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            const favorites = await prisma.favorite.findMany({
                where: { userId }
            });

            return reply.send(favorites);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };

    static markFavorite = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            const { id } = request.params as { id: string };

            const dbWord = await prisma.word.findUnique({ where: { id } });
            if (!dbWord) {
                return reply.code(404).send({ message: "Word not found" });
            }

            const favorite = await prisma.favorite.upsert({
                where: {
                    userId_wordId: { userId, wordId: dbWord.id },
                },
                update: {},
                create: {
                    user: { connect: { id: userId } },
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
            return reply.code(500).send({ message: "Internal server error" });
        }
    };

    static unmarkFavorite = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as FastifyCustomRequest).user.id;
            const { id } = request.params as { id: string };

            const dbWord = await prisma.word.findUnique({ where: { id } });
            if (!dbWord) {
                return reply.code(404).send({ message: "Word not found" });
            }

            await prisma.favorite.deleteMany({
                where: { userId, wordId: dbWord.id }
            });

            return reply.code(204).send();
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    };
}