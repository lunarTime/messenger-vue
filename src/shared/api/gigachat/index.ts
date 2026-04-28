interface RewriteResponse {
  rewrittenText: string;
}

export async function rewriteText(text: string): Promise<string> {
  let apiUrl = (import.meta.env.VITE_AI_API_URL as string) || "/api/rewrite";

  if (apiUrl.startsWith("http") && !apiUrl.includes("/api/")) {
    apiUrl = apiUrl.endsWith("/")
      ? `${apiUrl}api/rewrite`
      : `${apiUrl}/api/rewrite`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("ИИ-сервис временно недоступен");
    }

    const data = (await response.json()) as RewriteResponse;
    return data.rewrittenText;
  } catch (error) {
    throw new Error(`Не удалось перефразировать текст: ${error}`);
  }
}
