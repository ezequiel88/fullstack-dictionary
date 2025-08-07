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
      type: 'integer',
      example: 12345
    },
    previous: {
      type: 'string',
      format: 'ulid',
      nullable: true,
      example: '01hxyz...'
    },
    next: {
      type: 'string',
      format: 'ulid',
      nullable: true,
      example: '01hxza...'
    },
    hasNext: {
      type: 'boolean',
      example: true
    },
    hasPrev: {
      type: 'boolean',
      example: false
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
      example: '01hxyz...'
    },
    isFavorite: {
      type: 'boolean',
      example: false
    },
    word: {
      type: 'string',
      example: 'hello',
    },
    phonetic: {
      type: 'string',
      nullable: true,
      example: '/həˈloʊ/',
    },
    phonetics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            nullable: true,
            example: '/həˈloʊ/',
          },
          audio: {
            type: 'string',
            nullable: true,
            example: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3',
          },
          sourceUrl: {
            type: 'string',
            example: 'https://commons.wikimedia.org/w/index.php?curid=75797336',
          },
          license: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'BY-SA 4.0' },
              url: { type: 'string', format: 'uri', example: 'https://creativecommons.org/licenses/by-sa/4.0' },
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
            example: 'interjection',
          },
          definitions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                definition: { type: 'string', example: 'A greeting used when answering the telephone.' },
                example: { type: 'string', example: 'Hello? How may I help you?' },
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
        name: { type: 'string', example: 'CC BY-SA 3.0' },
        url: { type: 'string', format: 'uri', example: 'https://creativecommons.org/licenses/by-sa/3.0' },
      },
      required: ['name', 'url'],
    },
    sourceUrls: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri',
        example: 'https://en.wiktionary.org/wiki/hello',
      },
    },
  },
  required: ['word', 'phonetic', 'phonetics', 'meanings', 'sourceUrls'],
};

