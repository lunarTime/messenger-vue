export const VALIDATION_CONFIG = {
    MESSAGE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 1000,
        MAX_LINES: 100,
        RATE_LIMIT: {
            MAX_REQUESTS: 10,
            WINDOW_MS: 5000
        }
    },
    SEARCH: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        DEBOUNCE_MS: 500,
        MAX_RESULTS: 50,
        RATE_LIMIT: {
            MAX_REQUESTS: 20,
            WINDOW_MS: 6000
        }
    },
    TYPING: {
        DEBOUNCE_MS: 3000
    },
    TOAST: {
        LIFE_TIME: 3000
    }
} as const

export const XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /eval\(/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /<embed/gi,
    /<object/gi
] as const

export const INJECTION_PATTERNS = [/['";]/g, /--/g, /\/\*/g, /\$where/gi, /\{\s*\$\w+/g] as const
