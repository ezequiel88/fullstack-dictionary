import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import Fastify, { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import dotenv from 'dotenv';
import registerRoutes from "./infrastructure/http/routes.js";
import setupSwagger from "./infrastructure/swagger/swagger.js";

export function build(opts = {}): FastifyInstance {
  const server = Fastify({ 
    logger: process.env.NODE_ENV !== 'test',
    ...opts 
  });

  // Register JWT plugin
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'test-secret'
  });

  // Decorate with authenticate method
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

  // Register CORS
  server.register(fastifyCors);
  // Register routes
  server.register(registerRoutes);
  // Setup Swagger BEFORE routes (only in non-test environment)
  // if (process.env.NODE_ENV !== 'test') {
    server.register(setupSwagger);
  // }



  return server;
}

// Create and export default server instance
const server = build();

export default server;