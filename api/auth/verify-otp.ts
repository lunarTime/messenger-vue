import bcrypt from "bcryptjs";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../_lib/firebase-admin.js";
import { checkRateLimit } from "../_lib/rateLimit.js";
import {
  applyCors,
  getClientIp,
  normalizeEmail,
  type HandlerReq,
  type HandlerRes,
} from "../_lib/http.js";

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
    password?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    jobTitle?: unknown;
  };

  const email = normalizeEmail(body.email);
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const firstName =
    typeof body.firstName === "string"
      ? body.firstName.trim().slice(0, 50)
      : "";
  const lastName =
    typeof body.lastName === "string" ? body.lastName.trim().slice(0, 50) : "";
  const jobTitle =
    typeof body.jobTitle === "string" ? body.jobTitle.trim().slice(0, 100) : "";

  if (!email) return res.status(400).json({ error: "Некорректный email" });

  if (!/^\d{6}$/.test(code))
    return res.status(400).json({ error: "Код должен состоять из 6 цифр" });

  if (password.length < 6)
    return res.status(400).json({ error: "Пароль слишком короткий" });

  if (!firstName) return res.status(400).json({ error: "Имя обязательно" });

  try {
    const ip = getClientIp(req);
    const ipLimit = await checkRateLimit({
      bucket: "verify-otp:ip",
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
      bucket: "verify-otp:email",
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
    const ref = db.collection("emailOtps").doc(email);
    const snap = await ref.get();

    if (!snap.exists) {
      return res
        .status(400)
        .json({ error: "Код не запрашивался или истёк. Запросите новый" });
    }

    const data = snap.data() as {
      codeHash: string;
      expiresAt: Timestamp;
      attempts: number;
    };

    if (Date.now() > data.expiresAt.toMillis()) {
      await ref.delete();

      return res.status(400).json({ error: "Код истёк. Запросите новый" });
    }

    if (data.attempts >= MAX_ATTEMPTS) {
      await ref.delete();

      return res
        .status(429)
        .json({ error: "Слишком много попыток. Запросите новый код" });
    }

    const isValid = await bcrypt.compare(code, data.codeHash);

    if (!isValid) {
      await ref.update({ attempts: FieldValue.increment(1) });

      const left = MAX_ATTEMPTS - data.attempts - 1;

      return res.status(400).json({
        error:
          left > 0 ? `Неверный код. Осталось попыток: ${left}` : "Неверный код",
      });
    }

    const auth = adminAuth();
    const displayName = lastName ? `${firstName} ${lastName}` : firstName;

    let userRecord;

    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
    } catch (e: any) {
      if (e?.code === "auth/email-already-exists") {
        await ref.delete();

        return res.status(409).json({ error: "Email уже зарегистрирован" });
      }

      throw e;
    }

    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        id: userRecord.uid,
        email,
        displayName,
        firstName,
        lastName: lastName || "",
        jobTitle,
        photoURL: null,
        isOnline: true,
        createdAt: FieldValue.serverTimestamp(),
        lastSeen: FieldValue.serverTimestamp(),
      });

    await ref.delete();

    const customToken = await auth.createCustomToken(userRecord.uid);

    return res.status(200).json({ ok: true, customToken });
  } catch (error) {
    console.error("verify-otp error:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ error: message });
  }
}
