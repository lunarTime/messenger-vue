import bcrypt from "bcryptjs";
import { adminAuth, adminDb } from "../_lib/firebase-admin";
import { sendOtpEmail } from "../_lib/mailer";
import {
  applyCors,
  getClientIp,
  normalizeEmail,
  type HandlerReq,
  type HandlerRes,
} from "../_lib/http";
import { checkRateLimit } from "../_lib/rateLimit";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 4;

export default async function handler(req: HandlerReq, res: HandlerRes) {
  applyCors(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = (req.body || {}) as { email?: unknown; firstName?: unknown };
  const email = normalizeEmail(body.email);
  const firstName =
    typeof body.firstName === "string"
      ? body.firstName.trim().slice(0, 50)
      : "";

  if (!email) return res.status(400).json({ error: "Некорректный email" });
  if (!firstName) return res.status(400).json({ error: "Имя обязательно" });

  try {
    const ip = getClientIp(req);
    const ipLimit = await checkRateLimit({
      bucket: "send-otp:ip",
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
      bucket: "send-otp:email",
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

    try {
      await adminAuth().getUserByEmail(email);
      return res.status(409).json({ error: "Email уже зарегистрирован" });
    } catch (e: any) {
      if (e?.code !== "auth/user-not-found") throw e;
    }

    const db = adminDb();
    const ref = db.collection("emailOtps").doc(email);
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

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);

    await ref.set({
      codeHash,
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      createdAt: now,
    });

    await sendOtpEmail(email, code, firstName);

    return res.status(200).json({ ok: true, expiresIn: OTP_TTL_MS / 1000 });
  } catch (error) {
    console.error("send-otp error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ error: message });
  }
}
