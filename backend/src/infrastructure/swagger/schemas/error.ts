import { OpenAPIV3 } from 'openapi-types';

export const ErrorResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message']
};