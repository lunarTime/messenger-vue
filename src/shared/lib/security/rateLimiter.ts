import type { RateLimitConfig, RateLimitEntry, RateLimitInfo } from '@/shared/types/rateLimits'

class RateLimiter {
    private limits = new Map<string, RateLimitEntry>()
    private cleanupInterval: ReturnType<typeof setInterval> | null = null

    constructor() {
        if (typeof window !== 'undefined') {
            this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
        }
    }

    check(key: string, config: RateLimitConfig): boolean {
        const now = Date.now()
        const entry = this.limits.get(key)

        if (!entry || now > entry.resetTime) {
            this.limits.set(key, {
                count: 1,
                resetTime: now + config.windowMs,
                firstRequestTime: now
            })

            return true
        }

        if (entry.count >= config.maxRequests) {
            return false
        }

        entry.count++

        return true
    }

    getInfo(key: string, maxRequests: number): RateLimitInfo | null {
        const entry = this.limits.get(key)

        if (!entry) {
            return {
                remaining: maxRequests,
                resetIn: 0,
                blocked: false
            }
        }

        const now = Date.now()
        const resetIn = Math.max(0, entry.resetTime - now)
        const remaining = Math.max(0, maxRequests - entry.count)
        const blocked = entry.count >= maxRequests

        return {
            remaining,
            resetIn,
            blocked
        }
    }

    reset(key: string): void {
        this.limits.delete(key)
    }

    resetAll(): void {
        this.limits.clear()
    }

    cleanup(): void {
        const now = Date.now()

        for (const [key, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(key)
            }
        }
    }

    size(): number {
        return this.limits.size
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval)

            this.cleanupInterval = null
        }

        this.resetAll()
    }
}

export const rateLimiter = new RateLimiter()

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        rateLimiter.destroy()
    })
}
