import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const server = Fastify({ logger: true });

await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!
});

server.decorate(
    'authenticate',
    async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    }
);

export default server;