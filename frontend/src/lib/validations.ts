import { z } from 'zod';

// Auth validation schemas (matching backend)
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome pode conter apenas letras e espaços'),
  email: z
    .string()
    .email('Formato de email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email('Formato de email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

// Word search validation
export const wordSearchSchema = z.object({
  search: z.string()
    .min(1, 'Termo de busca é obrigatório')
    .max(100, 'Termo de busca deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z\s\-']+$/, 'Termo de busca pode conter apenas letras, espaços, hífens e apostrofes')
    .optional(),
  limit: z.number()
    .min(1, 'Limite deve ser pelo menos 1')
    .max(100, 'Limite deve ser no máximo 100')
    .optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  limit: z.number()
    .min(1, 'Limite deve ser pelo menos 1')
    .max(100, 'Limite deve ser no máximo 100')
    .optional(),
  page: z.number()
    .min(1, 'Página deve ser pelo menos 1')
    .optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type WordSearchInput = z.infer<typeof wordSearchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Validation helper functions
export const validateSignUp = (data: unknown) => {
  return signUpSchema.safeParse(data);
};

export const validateSignIn = (data: unknown) => {
  return signInSchema.safeParse(data);
};

export const validateWordSearch = (data: unknown) => {
  return wordSearchSchema.safeParse(data);
};

export const validatePagination = (data: unknown) => {
  return paginationSchema.safeParse(data);
};

// Form validation helpers
export const getFieldError = (errors: z.ZodError, fieldName: string): string | undefined => {
  const fieldError = errors.issues.find(error => error.path.includes(fieldName));
  return fieldError?.message;
};

export const hasFieldError = (errors: z.ZodError, fieldName: string): boolean => {
  return errors.issues.some(error => error.path.includes(fieldName));
};