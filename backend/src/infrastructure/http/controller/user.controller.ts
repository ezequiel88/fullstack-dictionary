import { DependencyContainer } from '../../container/dependency-container.js';
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from 'fastify';

export class UserController {
  private static container = DependencyContainer.getInstance();

  static getProfile = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      if (!userId) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }

      const userService = UserController.container.userService;
      const user = await userService.getUserById(userId);

      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return reply.send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };


  static getHistory = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      const historyRepository = UserController.container.historyRepository;
      const history = await historyRepository.findByUser(userId);

      return reply.send(history);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };

  static getFavorites = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      const favoriteRepository = UserController.container.favoriteRepository;
      const favorites = await favoriteRepository.findByUser(userId);

      return reply.send(favorites);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };

  static markFavorite = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      const { wordId } = request.params as { wordId: string };

      const wordRepository = UserController.container.wordRepository;
      const favoriteRepository = UserController.container.favoriteRepository;

      const dbWord = await wordRepository.findById(wordId);
      if (!dbWord) {
        return reply.code(404).send({ message: 'Word not found' });
      }

      const favorite = await favoriteRepository.create(userId, dbWord.id);

      return reply.send({
        id: favorite.id,
        word: {
          id: favorite.word.id,
          value: favorite.word.value,
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };

  static unmarkFavorite = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      const { wordId } = request.params as { wordId: string };

      const wordRepository = UserController.container.wordRepository;
      const favoriteRepository = UserController.container.favoriteRepository;

      const dbWord = await wordRepository.findById(wordId);
      if (!dbWord) {
        return reply.code(404).send({ message: 'Word not found' });
      }

      await favoriteRepository.delete(userId, dbWord.id);

      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };
}