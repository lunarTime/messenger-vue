export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function getErrorCode(error: unknown): string {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return "";
  }

  return typeof error.code === "string" ? error.code : "";
}

export function getRetryAfter(error: unknown): number | null {
  if (typeof error !== "object" || error === null || !("retryAfter" in error)) {
    return null;
  }

  return typeof error.retryAfter === "number" ? error.retryAfter : null;
}
