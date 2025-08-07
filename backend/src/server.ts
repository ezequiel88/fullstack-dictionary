import fastifyJwt from "@fastify/jwt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from 'dotenv';
import registerRoutes from "@/infrastructure/http/routes.js";

dotenv.config({ path: './.env' });

const server = Fastify({ logger: true });

await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!
});

server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    }
);

await registerRoutes(server);

export default server;