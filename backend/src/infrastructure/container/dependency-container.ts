import { UserService } from '../../application/user.service.js';
import { DictionaryService } from '../../application/dictionary.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { WordRepository, FavoriteRepository, HistoryRepository } from '../repositories/word.repository.js';
import { CacheService } from '../services/cache.service.js';
import { ExternalDictionaryService } from '../services/external-dictionary.service.js';

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Repositories
  private _userRepository: UserRepository;
  private _wordRepository: WordRepository;
  private _favoriteRepository: FavoriteRepository;
  private _historyRepository: HistoryRepository;

  // Services
  private _cacheService: CacheService;
  private _externalDictionaryService: ExternalDictionaryService;
  private _userService: UserService;
  private _dictionaryService: DictionaryService;

  private constructor() {
    // Initialize repositories
    this._userRepository = new UserRepository();
    this._wordRepository = new WordRepository();
    this._favoriteRepository = new FavoriteRepository();
    this._historyRepository = new HistoryRepository();

    // Initialize services
    this._cacheService = new CacheService();
    this._externalDictionaryService = new ExternalDictionaryService();
    this._userService = new UserService(this._userRepository);
    this._dictionaryService = new DictionaryService(
      this._externalDictionaryService,
      this._cacheService
    );
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  // Getters for repositories
  get userRepository(): UserRepository {
    return this._userRepository;
  }

  get wordRepository(): WordRepository {
    return this._wordRepository;
  }

  get favoriteRepository(): FavoriteRepository {
    return this._favoriteRepository;
  }

  get historyRepository(): HistoryRepository {
    return this._historyRepository;
  }

  // Getters for services
  get cacheService(): CacheService {
    return this._cacheService;
  }

  get externalDictionaryService(): ExternalDictionaryService {
    return this._externalDictionaryService;
  }

  get userService(): UserService {
    return this._userService;
  }

  get dictionaryService(): DictionaryService {
    return this._dictionaryService;
  }
}