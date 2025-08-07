import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters long'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const signInSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters long'),
  password: z.string()
    .min(1, 'Password is required')
    .max(100, 'Password must be at most 100 characters long'),
});

// User schemas
export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters long')
    .optional(),
});

// Word schemas
export const wordIdSchema = z.object({
  wordId: z.string()
    .uuid('Invalid word ID format'),
});

export const wordQuerySchema = z.object({
  search: z.string()
    .min(1, 'Search term is required')
    .max(100, 'Search term must be at most 100 characters long')
    .regex(/^[a-zA-Z\s-']+$/, 'Search term can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(20),
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .default(1),
  cursor: z.string()
    .uuid('Invalid cursor format')
    .optional(),
});

// Pagination schemas
export const paginationQuerySchema = z.object({
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(20),
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .default(1),
});

// Response schemas
export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

export const successResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

export const paginatedResponseSchema = z.object({
  results: z.array(z.any()),
  totalDocs: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type WordIdParams = z.infer<typeof wordIdSchema>;
export type WordQueryParams = z.infer<typeof wordQuerySchema>;
export type PaginationQueryParams = z.infer<typeof paginationQuerySchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;