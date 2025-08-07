import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

export class ValidationMiddleware {
  static validateBody(schema: ZodSchema) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        schema.parse(request.body);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Validation error',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Internal server error',
        });
      }
    };
  }

  static validateParams(schema: ZodSchema) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        schema.parse(request.params);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Invalid parameters',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Internal server error',
        });
      }
    };
  }

  static validateQuery(schema: ZodSchema) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        schema.parse(request.query);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Invalid query parameters',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Internal server error',
        });
      }
    };
  }
}