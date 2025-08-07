import { ErrorResponseSchema } from "../schemas/error.js";
import { WordDefinitionSchema, WordListSchema } from "../schemas/word.js";

export const getWordSchema = {
  summary: "Get word information",
  tags: ["Word"],
  params: {
    type: "object",
    properties: {
      wordId: { type: "string" }
    }
  },
  response: {
    200: WordDefinitionSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const getWordsListSchema = {
  summary: "Get words list",
  tags: ["Word"],
  querystring: {
    type: "object",
    properties: {
      search: { type: "string" },
      limit: { type: "number", default: 50 },
      next: { type: "string" },
      previous: { type: "string" }
    }
  },
  response: {
    200: WordListSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};