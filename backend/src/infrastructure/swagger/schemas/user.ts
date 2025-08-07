import { OpenAPIV3 } from 'openapi-types';

const UserSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'ulid' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'email', 'createdAt']
};

const UserCreateSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  },
  required: ['name', 'email', 'password']
};

const UserLoginSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', description: 'User email' },
    password: { type: 'string', minLength: 6, description: 'User password' }
  },
  required: ['email', 'password']
};

const UserLoginResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'ulid' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        createdAt: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'name', 'email', 'createdAt']
    },
    token: {
      type: 'string',
      description: 'JWT Token'
    }
  },
  required: ['user', 'token']
};

export {
  UserSchema,
  UserCreateSchema,
  UserLoginSchema,
  UserLoginResponseSchema
};