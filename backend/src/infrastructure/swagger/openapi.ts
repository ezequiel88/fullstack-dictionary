import { OpenAPIV3 } from 'openapi-types';
import { UserCreateSchema, UserLoginResponseSchema, UserLoginSchema, UserSchema } from '@/infrastructure/swagger/schemas/user.js';
import { ErrorResponseSchema } from '@/infrastructure/swagger/schemas/error.js';
import { FavoriteSchema, FavoritesSchema, FavoriteRequestSchema } from './schemas/favorite.js';
import HistorySchema from './schemas/history.js';
import { WordDefinitionSchema, WordListSchema } from './schemas/word.js';

export const openapi: OpenAPIV3.Document = {
    openapi: '3.0.3',
    info: {
        title: 'Fullstack Challenge - Dictionary API',
        description: 'API for Fullstack Challenge - Dictionary (by Coodesh)',
        version: '1.0.0',
        contact: {
            name: 'Ezequiel Tavares',
            url: 'https://github.com/ezequiel88'
        },
    },
    servers: [
        {
            url: 'http://localhost:3030',
            description: 'Local Server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: ErrorResponseSchema,
            Favorite: FavoriteSchema,
            Favorites: FavoritesSchema,
            FavoriteRequest: FavoriteRequestSchema,
            History: HistorySchema,
            User: UserSchema,
            UserCreate: UserCreateSchema,
            UserLogin: UserLoginSchema,
            UserLoginResponse: UserLoginResponseSchema,
            WordDefinition: WordDefinitionSchema,
            WordList: WordListSchema,
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    paths: {}
}