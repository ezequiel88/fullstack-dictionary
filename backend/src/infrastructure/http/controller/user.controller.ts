import { DependencyContainer } from '../../container/dependency-container.js';
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from 'fastify';

export class UserController {
  private static container = DependencyContainer.getInstance();

  static getProfile = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      if (!userId) {
        return reply.code(401).send({ message: 'Não autorizado' });
      }

      const userService = UserController.container.userService;
      const user = await userService.getUserById(userId);

      if (!user) {
        return reply.code(404).send({ message: 'Usuário não encontrado' });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return reply.send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Erro interno do servidor' });
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
      return reply.code(500).send({ message: 'Erro interno do servidor' });
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
      return reply.code(500).send({ message: 'Erro interno do servidor' });
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
        return reply.code(404).send({ message: 'Palavra não encontrada' });
      }

      // Usar upsert para criar ou retornar o favorito existente
      const favorite = await favoriteRepository.upsert(userId, dbWord.id);

      return reply.send({
        id: favorite.id,
        word: {
          id: favorite.word.id,
          value: favorite.word.value,
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Erro interno do servidor' });
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
        return reply.code(404).send({ message: 'Palavra não encontrada' });
      }

      // Verificar se o favorito existe antes de tentar deletar
      const existingFavorite = await favoriteRepository.findByUserAndWord(userId, dbWord.id);
      if (!existingFavorite) {
        return reply.code(404).send({ message: 'Favorito não encontrado' });
      }

      await favoriteRepository.delete(userId, dbWord.id);

      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Erro interno do servidor' });
    }
  };
}