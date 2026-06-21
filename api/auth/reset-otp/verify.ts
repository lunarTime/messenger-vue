import bcrypt from "bcryptjs";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../../_lib/firebase-admin.js";
import {
  applyCors,
  getClientIp,
  getErrorCode,
  normalizeEmail,
  type HandlerReq,
  type HandlerRes,
} from "../../_lib/http.js";
import { checkRateLimit } from "../../_lib/rateLimit.js";

const MAX_ATTEMPTS = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 10;

export default async function handler(req: HandlerReq, res: HandlerRes) {
  applyCors(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = (req.body || {}) as {
    email?: unknown;
    code?: unknown;
    newPassword?: unknown;
  };

  const email = normalizeEmail(body.email);
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  if (!email) return res.status(400).json({ error: "Некорректный email" });

  if (!/^\d{6}$/.test(code))
    return res.status(400).json({ error: "Код должен состоять из 6 цифр" });

  if (newPassword.length < 6)
    return res.status(400).json({ error: "Пароль слишком короткий" });

  try {
    const ip = getClientIp(req);
    const ipLimit = await checkRateLimit({
      bucket: "reset-verify:ip",
      key: ip,
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    });

    if (!ipLimit.allowed) {
      return res.status(429).json({
        error: `Слишком много попыток. Попробуйте через ${ipLimit.retryAfter} сек`,
        retryAfter: ipLimit.retryAfter,
      });
    }

    const emailLimit = await checkRateLimit({
      bucket: "reset-verify:email",
      key: email,
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    });

    if (!emailLimit.allowed) {
      return res.status(429).json({
        error: `Слишком много попыток для этого email. Попробуйте через ${emailLimit.retryAfter} сек`,
        retryAfter: emailLimit.retryAfter,
      });
    }

    const db = adminDb();
    const ref = db.collection("passwordResetOtps").doc(email);
    const snap = await ref.get();

    if (!snap.exists) {
      return res
        .status(400)
        .json({ error: "Код не запрашивался или истёк. Запросите новый" });
    }

    const data = snap.data() as {
      codeHash?: string;
      expiresAt?: Timestamp;
      attempts?: number;
    };

    if (!data.codeHash || !(data.expiresAt instanceof Timestamp)) {
      return res
        .status(400)
        .json({ error: "Код не запрашивался или истёк. Запросите новый" });
    }

    if (Date.now() > data.expiresAt.toMillis()) {
      await ref.delete();

      return res.status(400).json({ error: "Код истёк. Запросите новый" });
    }

    const attempts = data.attempts ?? 0;

    if (attempts >= MAX_ATTEMPTS) {
      await ref.delete();

      return res
        .status(429)
        .json({ error: "Слишком много попыток. Запросите новый код" });
    }

    const isValid = await bcrypt.compare(code, data.codeHash);

    if (!isValid) {
      await ref.update({ attempts: FieldValue.increment(1) });

      const left = MAX_ATTEMPTS - attempts - 1;

      return res.status(400).json({
        error:
          left > 0 ? `Неверный код. Осталось попыток: ${left}` : "Неверный код",
      });
    }

    const auth = adminAuth();

    let userRecord;

    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (caughtError) {
      if (getErrorCode(caughtError) === "auth/user-not-found") {
        await ref.delete();

        return res.status(400).json({ error: "Пользователь не найден" });
      }

      throw caughtError;
    }

    await auth.updateUser(userRecord.uid, { password: newPassword });
    await auth.revokeRefreshTokens(userRecord.uid);
    await ref.delete();

    const customToken = await auth.createCustomToken(userRecord.uid);

    return res.status(200).json({ ok: true, customToken });
  } catch (error) {
    console.error("reset-otp/verify error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ error: message });
  }
}
