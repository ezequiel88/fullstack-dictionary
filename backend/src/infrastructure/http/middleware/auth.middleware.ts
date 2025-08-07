import { DependencyContainer } from '@/infrastructure/container/dependency-container.js';
import { FastifyRequest, FastifyReply, FastifyCustomRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export class AuthMiddleware {
  static async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return reply.code(401).send({
          message: 'Authorization header is required',
        });
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        return reply.code(401).send({
          message: 'Token is required',
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        request.log.error('JWT_SECRET is not configured');
        return reply.code(500).send({
          message: 'Internal server error',
        });
      }

      let decoded: JWTPayload;
      try {
        decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      } catch (jwtError) {
        if (jwtError instanceof jwt.TokenExpiredError) {
          return reply.code(401).send({
            message: 'Token has expired',
          });
        }
        if (jwtError instanceof jwt.JsonWebTokenError) {
          return reply.code(401).send({
            message: 'Invalid token',
          });
        }
        throw jwtError;
      }

      if (!decoded.userId) {
        return reply.code(401).send({
          message: 'Invalid token payload',
        });
      }

      // Verify user still exists
      const container = DependencyContainer.getInstance();
      const user = await container.userService.getUserById(decoded.userId);

      if (!user) {
        return reply.code(401).send({
          message: 'User not found',
        });
      }

      // Attach user to request
      (request as FastifyCustomRequest).user = {
        id: user.id,
        email: user.email
      };

    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Internal server error',
      });
    }
  }

  static generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
      { userId },
      jwtSecret,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): JWTPayload {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, jwtSecret) as JWTPayload;
  }
}