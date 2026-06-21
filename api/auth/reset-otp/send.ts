import bcrypt from "bcryptjs";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../../_lib/firebase-admin.js";
import { sendPasswordResetEmail } from "../../_lib/mailer.js";
import {
  applyCors,
  getClientIp,
  getErrorCode,
  normalizeEmail,
  type HandlerReq,
  type HandlerRes,
} from "../../_lib/http.js";
import { checkRateLimit } from "../../_lib/rateLimit.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 4;

export default async function handler(req: HandlerReq, res: HandlerRes) {
  applyCors(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = (req.body || {}) as { email?: unknown };
  const email = normalizeEmail(body.email);

  if (!email) return res.status(400).json({ error: "Некорректный email" });

  try {
    const ip = getClientIp(req);
    const ipLimit = await checkRateLimit({
      bucket: "reset-otp:ip",
      key: ip,
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    });

    if (!ipLimit.allowed) {
      return res.status(429).json({
        error: `Слишком много запросов. Попробуйте через ${ipLimit.retryAfter} сек`,
        retryAfter: ipLimit.retryAfter,
      });
    }

    const emailLimit = await checkRateLimit({
      bucket: "reset-otp:email",
      key: email,
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    });

    if (!emailLimit.allowed) {
      return res.status(429).json({
        error: `Слишком много запросов для этого email. Попробуйте через ${emailLimit.retryAfter} сек`,
        retryAfter: emailLimit.retryAfter,
      });
    }

    const db = adminDb();
    const ref = db.collection("passwordResetOtps").doc(email);
    const now = Date.now();

    const existing = await ref.get();

    if (existing.exists) {
      const data = existing.data() as { lastSentAt?: number } | undefined;

      if (data?.lastSentAt && now - data.lastSentAt < RESEND_COOLDOWN_MS) {
        const retryAfter = Math.ceil(
          (RESEND_COOLDOWN_MS - (now - data.lastSentAt)) / 1000,
        );

        return res.status(429).json({
          error: `Подождите ${retryAfter} сек перед повторной отправкой`,
          retryAfter,
        });
      }
    }

    let userExists = false;

    try {
      await adminAuth().getUserByEmail(email);

      userExists = true;
    } catch (caughtError) {
      if (getErrorCode(caughtError) !== "auth/user-not-found") {
        throw caughtError;
      }
    }

    if (!userExists) {
      await ref.set({
        lastSentAt: now,
        createdAt: now,
        expiresAt: Timestamp.fromMillis(now + RESEND_COOLDOWN_MS),
      });

      return res.status(200).json({ ok: true, expiresIn: OTP_TTL_MS / 1000 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);

    await ref.set({
      codeHash,
      expiresAt: Timestamp.fromMillis(now + OTP_TTL_MS),
      attempts: 0,
      lastSentAt: now,
      createdAt: now,
    });

    await sendPasswordResetEmail(email, code);

    return res.status(200).json({ ok: true, expiresIn: OTP_TTL_MS / 1000 });
  } catch (error) {
    console.error("reset-otp/send error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ error: message });
  }
}
