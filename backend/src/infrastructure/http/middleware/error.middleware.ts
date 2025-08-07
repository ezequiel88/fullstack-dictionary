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
        message: 'Validation error',
        errors: formattedErrors,
      });
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          // Unique constraint violation
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] || 'field';
          return reply.code(409).send({
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
          });

        case 'P2025':
          // Record not found
          return reply.code(404).send({
            message: 'Record not found',
          });

        case 'P2003':
          // Foreign key constraint violation
          return reply.code(400).send({
            message: 'Invalid reference to related record',
          });

        case 'P2014':
          // Invalid ID
          return reply.code(400).send({
            message: 'Invalid ID provided',
          });

        default:
          return reply.code(500).send({
            message: 'Database error occurred',
          });
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return reply.code(400).send({
        message: 'Invalid data provided',
      });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send({
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send({
        message: 'Token has expired',
      });
    }

    // Fastify validation errors
    if (error.validation) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: error.validation.map(err => ({
          field: err.instancePath.replace('/', ''),
          message: err.message || 'Invalid value',
        })),
      });
    }

    // HTTP errors
    if (error.statusCode) {
      return reply.code(error.statusCode).send({
        message: error.message || 'An error occurred',
      });
    }

    // Default error
    return reply.code(500).send({
      message: 'Internal server error',
    });
  }

  static async handleNotFound(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return reply.code(404).send({
      message: `Route ${request.method} ${request.url} not found`,
    });
  }
}