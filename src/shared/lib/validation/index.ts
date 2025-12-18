import { z } from 'zod'
import { MessageSchema, SearchQuerySchema, EmailSchema, DisplayNameSchema } from '@/shared/lib/validation/schemas'

export type ValidationResult<T> =
    | {
          success: true
          data: T
      }
    | {
          success: false
          error: string
          issues?: z.core.$ZodIssue[]
      }

export function validateMessage(text: string): ValidationResult<string> {
    const result = MessageSchema.safeParse(text)

    if (result.success) {
        return {
            success: true,
            data: result.data
        }
    }

    return {
        success: false,
        error: result.error.issues[0]?.message || 'Ошибка валидации сообщения',
        issues: result.error.issues
    }
}

export function validateSearchQuery(query: string): ValidationResult<string> {
    const result = SearchQuerySchema.safeParse(query)

    if (result.success) {
        return {
            success: true,
            data: result.data
        }
    }

    return {
        success: false,
        error: result.error.issues[0]?.message || 'Ошибка валидации запроса',
        issues: result.error.issues
    }
}

export function validateEmail(email: string): ValidationResult<string> {
    const result = EmailSchema.safeParse(email)

    if (result.success) {
        return {
            success: true,
            data: result.data
        }
    }

    return {
        success: false,
        error: result.error.issues[0]?.message || 'Ошибка валидации email',
        issues: result.error.issues
    }
}

export function validateDisplayName(name: string): ValidationResult<string> {
    const result = DisplayNameSchema.safeParse(name)

    if (result.success) {
        return {
            success: true,
            data: result.data
        }
    }

    return {
        success: false,
        error: result.error.issues[0]?.message || 'Ошибка валидации имени',
        issues: result.error.issues
    }
}
