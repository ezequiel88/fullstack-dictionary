import { FastifyRequest, FastifyReply } from 'fastify';

declare module "fastify" {
   interface FastifyInstance {
      authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
   }

   interface FastifyCustomRequest extends FastifyRequest {
      user: {
         id: string;
         email: string;
      };
   }
}