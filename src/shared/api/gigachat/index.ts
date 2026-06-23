interface RewriteResponse {
  rewrittenText: string;
}

const DEFAULT_AI_API_URL = "/api/rewrite";

function normalizeApiUrl(value: unknown): string {
  const apiUrl = typeof value === "string" ? value.trim() : "";

  if (!apiUrl) return DEFAULT_AI_API_URL;

  if (apiUrl.startsWith("http") && !apiUrl.includes("/api/")) {
    return apiUrl.endsWith("/")
      ? `${apiUrl}api/rewrite`
      : `${apiUrl}/api/rewrite`;
  }

  return apiUrl;
}

function getCandidateUrls(): string[] {
  const primary = normalizeApiUrl(import.meta.env.VITE_AI_API_URL);
  const urls = [primary];

  if (primary !== DEFAULT_AI_API_URL) {
    urls.push(DEFAULT_AI_API_URL);
  }

  return [...new Set(urls)];
}

async function requestRewrite(apiUrl: string, text: string): Promise<string> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let detail = "";

    try {
      const data = (await response.json()) as { error?: unknown };
      detail = typeof data.error === "string" ? data.error : "";
    } catch {
      detail = await response.text().catch(() => "");
    }

    throw new Error(
      detail
        ? `ИИ-сервис временно недоступен: ${detail}`
        : "ИИ-сервис временно недоступен",
    );
  }

  const data = (await response.json()) as RewriteResponse;
  return data.rewrittenText;
}

export async function rewriteText(text: string): Promise<string> {
  const apiUrls = getCandidateUrls();
  let lastError: unknown = null;

  for (const apiUrl of apiUrls) {
    try {
      return await requestRewrite(apiUrl, text);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Не удалось перефразировать текст: ${lastError}`);
}
