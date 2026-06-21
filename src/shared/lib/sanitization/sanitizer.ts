import DOMPurify from 'isomorphic-dompurify'
import type { SanitizeOptions } from '@/shared/types/sanitize'
import { stripControlCharacters } from '@/shared/lib/string/controlCharacters'

export function sanitizeText(text: string, options: SanitizeOptions = {}): string {
    const { allowBasicHtml = false, maxLength, stripNewlines = false, normalizeSpaces = true } = options

    let sanitized = allowBasicHtml
        ? DOMPurify.sanitize(text, {
              ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
              ALLOWED_ATTR: ['href'],
              ALLOW_DATA_ATTR: false
          })
        : DOMPurify.sanitize(text, {
              ALLOWED_TAGS: [],
              ALLOWED_ATTR: [],
              KEEP_CONTENT: true
          })

    sanitized = stripControlCharacters(sanitized)

    if (stripNewlines) {
        sanitized = sanitized.replace(/[\r\n]+/g, ' ')
    }

    if (normalizeSpaces) {
        sanitized = sanitized.replace(/\s+/g, ' ')
    }

    sanitized = sanitized.normalize('NFKC')
    sanitized = sanitized.trim()

    if (maxLength && sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength)
    }

    return sanitized
}
