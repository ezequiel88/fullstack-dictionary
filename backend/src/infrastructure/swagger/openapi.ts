import { OpenAPIV3 } from 'openapi-types';
import { UserCreateSchema, UserLoginResponseSchema, UserLoginSchema, UserSchema } from '@/infrastructure/swagger/schemas/user.js';
import { ErrorResponseSchema } from '@/infrastructure/swagger/schemas/error.js';

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
            User: UserSchema,
            UserCreate: UserCreateSchema,
            UserLogin: UserLoginSchema,
            UserLoginResponse: UserLoginResponseSchema,
            ErrorResponse: ErrorResponseSchema,
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    paths: {}
}