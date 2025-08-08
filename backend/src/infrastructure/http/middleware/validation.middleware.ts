import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

export class ValidationMiddleware {
  static validateBody(schema: ZodSchema) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        schema.parse(request.body);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Erro de validação',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Erro interno do servidor',
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
          const formattedErrors = error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Parâmetros inválidos',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Erro interno do servidor',
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
          const formattedErrors = error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return reply.code(400).send({
            message: 'Parâmetros de consulta inválidos',
            errors: formattedErrors,
          });
        }
        
        request.log.error(error);
        return reply.code(500).send({
          message: 'Erro interno do servidor',
        });
      }
    };
  }
}