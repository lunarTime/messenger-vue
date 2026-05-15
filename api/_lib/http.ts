export type HandlerReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

export type HandlerRes = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => HandlerRes;
  json: (data: unknown) => void;
  end: () => void;
};

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || "";

  return raw
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

export function applyCors(req: HandlerReq, res: HandlerRes) {
  const allowed = getAllowedOrigins();
  const origin =
    (req.headers?.origin as string | undefined)?.replace(/\/+$/, "") || "";

  if (allowed.length === 0 || allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization",
  );
}

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;

  const trimmed = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;

  return trimmed;
}

export function getClientIp(req: HandlerReq): string {
  const fwd = req.headers?.["x-forwarded-for"];

  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }

  if (Array.isArray(fwd) && fwd.length > 0) {
    return String(fwd[0]).split(",")[0].trim();
  }

  const real = req.headers?.["x-real-ip"];

  if (typeof real === "string") return real;

  return req.socket?.remoteAddress || "unknown";
}
