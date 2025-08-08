import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'Nome pode conter apenas letras e espaços'),
  email: z
    .email('Formato de email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
});

export const signInSchema = z.object({
  email: z
    .email('Formato de email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

// User schemas
export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'Nome pode conter apenas letras e espaços')
    .optional(),
  email: z.string()
    .email('Formato de email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .optional(),
});

// Word schemas
export const wordIdSchema = z.object({
  wordId: z.string()
    .uuid('Formato de ID da palavra inválido'),
});

export const wordQuerySchema = z.object({
  search: z.string()
    .min(1, 'Termo de busca é obrigatório')
    .max(100, 'Termo de busca deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z\s-']+$/, 'Termo de busca pode conter apenas letras, espaços, hífens e apostrofes')
    .optional(),
  limit: z.string()
    .regex(/^\d+$/, 'Limite deve ser um número')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limite deve estar entre 1 e 100')
    .optional()
    .default(20),
  page: z.string()
    .regex(/^\d+$/, 'Página deve ser um número')
    .transform(Number)
    .refine(val => val >= 1, 'Página deve ser pelo menos 1')
    .optional()
    .default(1),
  cursor: z.string()
    .uuid('Formato de cursor inválido')
    .optional(),
});

// Pagination schemas
export const paginationQuerySchema = z.object({
  limit: z.string()
    .regex(/^\d+$/, 'Limite deve ser um número')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limite deve estar entre 1 e 100')
    .optional()
    .default(20),
  page: z.string()
    .regex(/^\d+$/, 'Página deve ser um número')
    .transform(Number)
    .refine(val => val >= 1, 'Página deve ser pelo menos 1')
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