export interface RateLimitEntry {
    count: number
    resetTime: number
    firstRequestTime: number
}

export interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

export interface RateLimitInfo {
    remaining: number
    resetIn: number
    blocked: boolean
}
