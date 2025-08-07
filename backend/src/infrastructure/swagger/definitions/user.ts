import { ErrorResponseSchema } from "../schemas/error.js";
import { FavoriteRequestSchema, FavoriteSchema, FavoritesSchema } from "../schemas/favorite.js";
import HistorySchema from "../schemas/history.js";
import { UserSchema } from "../schemas/user.js";

export const getProfileSchema = {
  summary: "Get user profile",
  tags: ["User"],
  response: {
    200: UserSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const getHistorySchema = {
  summary: "Get user words history",
  tags: ["User", "History"],
  response: {
    200: HistorySchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const getFavoritesSchema = {
  summary: "Get user words favorites",
  tags: ["User", "History"],
  response: {
    200: FavoritesSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};


export const markFavoriteSchema = {
  summary: "Mark word as favorite",
  tags: ["Favorite", "User", "Word"],
  body: FavoriteRequestSchema,
  response: {
    200: FavoriteSchema,
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const unmarkFavoriteSchema = {
  summary: "Unmark word as favorite",
  tags: ["Favorite", "User", "Word"],
  params: {
    type: "object",
    properties: {
      wordId: { type: "string" }
    },
    required: ["wordId"]
  },
  response: {
    204: {
      description: "No content"
    },
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};