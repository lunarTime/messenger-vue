function resolveBaseUrl(): string {
  if (import.meta.env.DEV) return "";

  const explicit = (
    import.meta.env.VITE_OTP_API_URL as string | undefined
  )?.trim();

  if (explicit) return explicit.replace(/\/+$/, "");

  const aiUrl = (import.meta.env.VITE_AI_API_URL as string | undefined)?.trim();

  if (aiUrl) {
    return new URL(aiUrl).origin;
  }

  return "";
}

function buildUrl(path: string): string {
  const base = resolveBaseUrl();

  if (!base) return path;

  return `${base}${path}`;
}

export interface SendOtpPayload {
  email: string;
  firstName: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SendOtpResult {
  expiresIn: number;
}

export interface VerifyOtpResult {
  customToken: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    const message = typeof data.error === "string" ? data.error : "Ошибка сети";
    const err = new Error(message) as Error & {
      status?: number;
      retryAfter?: number;
    };

    err.status = response.status;

    if (typeof data.retryAfter === "number") err.retryAfter = data.retryAfter;

    throw err;
  }

  return data as T;
}

export function sendOtp(payload: SendOtpPayload): Promise<SendOtpResult> {
  return postJson<SendOtpResult>("/api/auth/send-otp", payload);
}

export function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResult> {
  return postJson<VerifyOtpResult>("/api/auth/verify-otp", payload);
}
