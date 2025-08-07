import { DependencyContainer } from '../../container/dependency-container.js';
import { signInSchema, signUpSchema } from '../../validation/schemas.js';
import { FastifyRequest, FastifyReply } from 'fastify';

export class AuthController {
  private static container = DependencyContainer.getInstance();

  static signUp = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const parsed = signUpSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({ message: parsed.error.message });
      }

      const userService = AuthController.container.userService;
      const exists = await userService.getUserByEmail(parsed.data.email);

      if (exists) {
        return reply.code(400).send({ message: 'User already exists' });
      }

      const user = await userService.createUser(parsed.data);
      const token = await reply.jwtSign({ id: user.id, email: user.email });

      return reply.code(201).send({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }, 
        token 
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };

  static signIn = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const parsed = signInSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      const userService = AuthController.container.userService;
      const user = await userService.getUserByEmail(parsed.data.email);

      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      const isValid = await userService.validatePassword(parsed.data.password, user.password);

      if (!isValid) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      const token = await reply.jwtSign({ id: user.id, email: user.email });

      return reply.code(200).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        },
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };
}