import { OpenAPIV3 } from 'openapi-types';

export const WordListSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'ulid' },
          value: { type: 'string' }
        },
        required: ['id', 'value']
      }
    },
    totalDocs: {
      type: 'integer'
    },
    previous: {
      type: 'string',
      format: 'ulid',
      nullable: true
    },
    next: {
      type: 'string',
      format: 'ulid',
      nullable: true
    },
    hasNext: {
      type: 'boolean',
    },
    hasPrev: {
      type: 'boolean',
    }
  },
  required: ['results', 'totalDocs', 'hasNext', 'hasPrev']
};

export const WordDefinitionSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'ulid',
    },
    isFavorite: {
      type: 'boolean',
    },
    word: {
      type: 'string',
    },
    phonetic: {
      type: 'string',
      nullable: true,
    },
    phonetics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            nullable: true,
          },
          audio: {
            type: 'string',
            nullable: true,
          },
          sourceUrl: {
            type: 'string',
          },
          license: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string', format: 'uri' },
            },
            required: ['name', 'url'],
          },
        },
        required: ['text', 'audio'],
      },
    },
    meanings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          partOfSpeech: {
            type: 'string',
          },
          definitions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                definition: { type: 'string' },
                example: { type: 'string'},
                synonyms: {
                  type: 'array',
                  items: { type: 'string' },
                },
                antonyms: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
              required: ['definition', 'synonyms', 'antonyms'],
            },
          },
          synonyms: {
            type: 'array',
            items: { type: 'string' },
          },
          antonyms: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['partOfSpeech', 'definitions', 'synonyms', 'antonyms'],
      },
    },
    license: {
      type: 'object',
      nullable: true,
      properties: {
        name: { type: 'string', },
        url: { type: 'string', format: 'uri',},
      },
      required: ['name', 'url'],
    },
    sourceUrls: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri',
      },
    },
  },
  required: ['word', 'phonetic', 'phonetics', 'meanings', 'sourceUrls'],
};

