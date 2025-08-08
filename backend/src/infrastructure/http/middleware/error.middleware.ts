import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class ErrorMiddleware {
  static async handleError(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    request.log.error(error);

    // Zod validation errors
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

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          // Unique constraint violation
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] || 'campo';
          return reply.code(409).send({
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} já existe`,
          });

        case 'P2025':
          // Record not found
          return reply.code(404).send({
            message: 'Registro não encontrado',
          });

        case 'P2003':
          // Foreign key constraint violation
          return reply.code(400).send({
            message: 'Referência inválida para registro relacionado',
          });

        case 'P2014':
          // Invalid ID
          return reply.code(400).send({
            message: 'ID inválido fornecido',
          });

        default:
          return reply.code(500).send({
            message: 'Erro de banco de dados ocorreu',
          });
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return reply.code(400).send({
        message: 'Dados inválidos fornecidos',
      });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send({
        message: 'Token inválido',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send({
        message: 'Token expirado',
      });
    }

    // Fastify validation errors
    if (error.validation) {
      return reply.code(400).send({
        message: 'Erro de validação',
        errors: error.validation.map(err => ({
          field: err.instancePath.replace('/', ''),
          message: err.message || 'Valor inválido',
        })),
      });
    }

    // HTTP errors
    if (error.statusCode) {
      return reply.code(error.statusCode).send({
        message: error.message || 'Ocorreu um erro',
      });
    }

    // Default error
    return reply.code(500).send({
      message: 'Erro interno do servidor',
    });
  }

  static async handleNotFound(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return reply.code(404).send({
      message: `Rota ${request.method} ${request.url} não encontrada`,
    });
  }
}