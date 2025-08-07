import { OpenAPIV3 } from 'openapi-types';

const FavoriteRequestSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    wordId: { type: 'string' },
  },
  required: ['wordId']
};

const FavoriteSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'ulid' },
    userId: { type: 'string', format: 'ulid' },
    wordId: { type: 'string', format: 'ulid' }
  },
  required: ['id', 'userId', 'wordId']
};

const FavoritesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'ulid' },
      userId: { type: 'string', format: 'ulid' },
      wordId: { type: 'string', format: 'ulid' }
    },
    required: ['id', 'userId', 'wordId']
  }
};

export {
  FavoriteRequestSchema,
  FavoritesSchema,
  FavoriteSchema
}
