import { OpenAPIV3 } from 'openapi-types';

const HistorySchema: OpenAPIV3.SchemaObject = {
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

export default HistorySchema
