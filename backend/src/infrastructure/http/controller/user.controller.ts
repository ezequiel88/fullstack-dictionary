import { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
    static getProfile = async (request: FastifyRequest, reply: FastifyReply) => { };

    static getHistory = async (request: FastifyRequest, reply: FastifyReply) => { };

    static getFavorites = async (request: FastifyRequest, reply: FastifyReply) => { };

    static markFavorite = async (request: FastifyRequest, reply: FastifyReply) => { };

    static unmarkFavorite = async (request: FastifyRequest, reply: FastifyReply) => { };
}