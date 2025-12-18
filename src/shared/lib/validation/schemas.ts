import { z } from 'zod'
import { VALIDATION_CONFIG, XSS_PATTERNS, INJECTION_PATTERNS } from '@/shared/config/validation.config'

const hasXSS = (val: string): boolean => {
    return XSS_PATTERNS.some(pattern => pattern.test(val))
}

const hasControlChars = (val: string): boolean => {
    return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(val)
}

const hasInjection = (val: string): boolean => {
    return INJECTION_PATTERNS.some(pattern => pattern.test(val))
}

const baseTextSchema = z
    .string({
        message: 'Должно быть строкой'
    })
    .trim()

export const MessageSchema = baseTextSchema
    .min(VALIDATION_CONFIG.MESSAGE.MIN_LENGTH, `Минимальная длина ${VALIDATION_CONFIG.MESSAGE.MIN_LENGTH} символ`)
    .max(VALIDATION_CONFIG.MESSAGE.MAX_LENGTH, `Максимальная длина ${VALIDATION_CONFIG.MESSAGE.MAX_LENGTH} символов`)
    .refine(val => !hasXSS(val), {
        message: 'Обнаружен недопустимый контент (XSS)'
    })
    .refine(val => !hasControlChars(val), {
        message: 'Обнаружены недопустимые управляющие символы'
    })

export const SearchQuerySchema = baseTextSchema
    .min(VALIDATION_CONFIG.SEARCH.MIN_LENGTH, `Минимальная длина ${VALIDATION_CONFIG.SEARCH.MIN_LENGTH} символа`)
    .max(VALIDATION_CONFIG.SEARCH.MAX_LENGTH, `Максимальная длина ${VALIDATION_CONFIG.SEARCH.MAX_LENGTH} символов`)
    .refine(val => !hasXSS(val), {
        message: 'Обнаружен недопустимый контент (XSS)'
    })
    .refine(val => !hasControlChars(val), {
        message: 'Обнаружены недопустимые символы'
    })
    .refine(val => !hasInjection(val), {
        message: 'Обнаружена попытка инъекции'
    })
    .refine(val => /^[a-zA-Zа-яА-ЯёЁ0-9]/.test(val), {
        message: 'Запрос не может начинаться со спецсимвола'
    })

export const EmailSchema = z
    .string({
        message: 'Email должен быть строкой'
    })
    .trim()
    .toLowerCase()
    .pipe(
        z.email({
            message: 'Некорректный email адрес'
        })
    )
    .pipe(z.string().max(100, 'Email слишком длинный'))

export const DisplayNameSchema = baseTextSchema
    .min(2, 'Минимальная длина 2 символа')
    .max(50, 'Максимальная длина 50 символов')
    .refine(val => !hasXSS(val), {
        message: 'Обнаружен недопустимый контент'
    })
    .refine(val => !hasControlChars(val), {
        message: 'Обнаружены недопустимые символы'
    })
