import { DependencyContainer } from '../../container/dependency-container.js';
import { CursorQuery } from '../../types/word.js';
import { FastifyCustomRequest, FastifyReply, FastifyRequest } from 'fastify';

export class WordController {
  private static container = DependencyContainer.getInstance();

  static getWordsList = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const query = request.query as CursorQuery;
      const wordRepository = WordController.container.wordRepository;
      
      const response = await wordRepository.findMany(query);
      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Erro interno do servidor' });
    }
  };


  static getWord = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const userId = (request as FastifyCustomRequest).user.id;
      const { wordId } = request.params as { wordId: string };

      const wordRepository = WordController.container.wordRepository;
      const dictionaryService = WordController.container.dictionaryService;
      const historyRepository = WordController.container.historyRepository;
      const favoriteRepository = WordController.container.favoriteRepository;

      const dbWord = await wordRepository.findById(wordId);
      if (!dbWord) {
        return reply.code(404).send({ message: 'Palavra não encontrada' });
      }

      const result = await dictionaryService.searchWord(dbWord.value);
      if (!result) {
        return reply.code(404).send({ message: 'Palavra não encontrada no dicionário' });
      }

      // Add to history
      await historyRepository.upsert(userId, dbWord.id);

      // Check if it's a favorite
      const favorite = await favoriteRepository.findByUserAndWord(userId, dbWord.id);

      return reply
        .header('x-cache', result.fromCache ? 'HIT' : 'MISS')
        .send({
          ...result,
          id: dbWord.id,
          isFavorite: !!favorite
        });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: 'Erro interno do servidor' });
    }
  };
}