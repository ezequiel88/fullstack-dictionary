import {
  signUpSchema,
  signInSchema,
  wordSearchSchema,
  paginationSchema,
  validateSignUp,
  validateSignIn,
  validateWordSearch,
  validatePagination,
  getFieldError,
  hasFieldError,
} from '../validations'
import { z } from 'zod'

describe('validations', () => {
  describe('signUpSchema', () => {
    const validSignUpData = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'Password123',
    }

    it('should validate correct sign up data', () => {
      const result = signUpSchema.safeParse(validSignUpData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid name', () => {
      const invalidData = { ...validSignUpData, name: 'A' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject name with numbers', () => {
      const invalidData = { ...validSignUpData, name: 'João123' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const invalidData = { ...validSignUpData, email: 'invalid-email' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject weak password', () => {
      const invalidData = { ...validSignUpData, password: 'weak' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase', () => {
      const invalidData = { ...validSignUpData, password: 'password123' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without lowercase', () => {
      const invalidData = { ...validSignUpData, password: 'PASSWORD123' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const invalidData = { ...validSignUpData, password: 'Password' }
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('signInSchema', () => {
    const validSignInData = {
      email: 'joao@example.com',
      password: 'password123',
    }

    it('should validate correct sign in data', () => {
      const result = signInSchema.safeParse(validSignInData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = { ...validSignInData, email: 'invalid-email' }
      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = { ...validSignInData, password: '' }
      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('wordSearchSchema', () => {
    it('should validate correct search data', () => {
      const validData = { search: 'hello', limit: 10 }
      const result = wordSearchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow optional fields', () => {
      const result = wordSearchSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should reject search with numbers', () => {
      const invalidData = { search: 'hello123' }
      const result = wordSearchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should allow hyphens and apostrophes', () => {
      const validData = { search: "don't-worry" }
      const result = wordSearchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject limit too high', () => {
      const invalidData = { limit: 101 }
      const result = wordSearchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject limit too low', () => {
      const invalidData = { limit: 0 }
      const result = wordSearchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('paginationSchema', () => {
    it('should validate correct pagination data', () => {
      const validData = { limit: 10, page: 1 }
      const result = paginationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow optional fields', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should reject page less than 1', () => {
      const invalidData = { page: 0 }
      const result = paginationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('validation helper functions', () => {
    it('should validate sign up data', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'Password123',
      }
      const result = validateSignUp(validData)
      expect(result.success).toBe(true)
    })

    it('should validate sign in data', () => {
      const validData = {
        email: 'joao@example.com',
        password: 'password123',
      }
      const result = validateSignIn(validData)
      expect(result.success).toBe(true)
    })

    it('should validate word search data', () => {
      const validData = { search: 'hello' }
      const result = validateWordSearch(validData)
      expect(result.success).toBe(true)
    })

    it('should validate pagination data', () => {
      const validData = { limit: 10 }
      const result = validatePagination(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('error helper functions', () => {
    const createError = (fieldName: string, message: string) => {
      return new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message,
        },
      ])
    }

    it('should get field error', () => {
      const error = createError('email', 'Email is invalid')
      expect(getFieldError(error, 'email')).toBe('Email is invalid')
    })

    it('should return undefined for non-existent field', () => {
      const error = createError('email', 'Email is invalid')
      expect(getFieldError(error, 'password')).toBeUndefined()
    })

    it('should check if field has error', () => {
      const error = createError('email', 'Email is invalid')
      expect(hasFieldError(error, 'email')).toBe(true)
      expect(hasFieldError(error, 'password')).toBe(false)
    })
  })
})