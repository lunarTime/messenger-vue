import { createHash } from "node:crypto";
import { adminDb } from "./firebase-admin";

const COLLECTION = "rateLimits";

export interface RateLimitOptions {
  bucket: string;
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

function makeDocId(bucket: string, key: string): string {
  const hash = createHash("sha256")
    .update(`${bucket}:${key}`)
    .digest("hex")
    .slice(0, 32);

  return `${bucket}_${hash}`;
}

export async function checkRateLimit(
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const { bucket, key, limit, windowMs } = opts;
  const db = adminDb();
  const ref = db.collection(COLLECTION).doc(makeDocId(bucket, key));
  const now = Date.now();
  const cutoff = now - windowMs;

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const raw = snap.exists
      ? (snap.data() as { hits?: unknown }).hits
      : undefined;

    const hits: number[] = Array.isArray(raw)
      ? (raw as unknown[]).filter(
          (v): v is number => typeof v === "number" && v > cutoff,
        )
      : [];

    if (hits.length >= limit) {
      const oldest = hits[0];
      const retryAfter = Math.max(
        1,
        Math.ceil((oldest + windowMs - now) / 1000),
      );

      tx.set(
        ref,
        { hits, expiresAt: hits[hits.length - 1] + windowMs },
        { merge: true },
      );

      return { allowed: false, remaining: 0, retryAfter };
    }

    hits.push(now);
    tx.set(ref, { hits, expiresAt: now + windowMs }, { merge: true });

    return { allowed: true, remaining: limit - hits.length, retryAfter: 0 };
  });
}
