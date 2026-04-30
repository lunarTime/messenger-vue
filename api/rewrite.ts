type ChatRequest = {
  text?: string;
};

type ChatResponse = {
  rewrittenText?: string;
  error?: string;
};

type HandlerReq = {
  method?: string;
  body?: ChatRequest;
};

type HandlerRes = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => HandlerRes;
  json: (data: ChatResponse) => void;
  end: () => void;
};

interface GigaChatAuthResponse {
  access_token: string;
  expires_at: number;
}

interface GigaChatMessage {
  role: string;
  content: string;
}

interface GigaChatResponse {
  choices: {
    message: GigaChatMessage;
    index: number;
    finish_reason: string;
  }[];
}

export default async function handler(req: HandlerReq, res: HandlerRes) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body as { text?: string };
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const clientId = process.env.GIGACHAT_CLIENT_ID;
  const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Missing GigaChat credentials" });
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const authResponse = await fetch(
      "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${authHeader}`,
          RqUID: crypto.randomUUID(),
        },
        body: new URLSearchParams({ scope: "GIGACHAT_API_PERS" }),
      },
    );

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Auth failed: ${errorText}`);
    }

    const authData = (await authResponse.json()) as GigaChatAuthResponse;
    const token = authData.access_token;

    const aiResponse = await fetch(
      "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: "GigaChat",
          messages: [
            {
              role: "system",
              content:
                process.env.GIGACHAT_SYSTEM_PROMPT ||
                "Ты — профессиональный корпоративный помощник. Перепиши сообщение пользователя в официально-деловом стиле. Сделай его вежливым. Верни только переписанный текст.",
            },
            { role: "user", content: text },
          ],
          temperature: 0.7,
        }),
      },
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`GigaChat failed: ${errorText}`);
    }

    const aiData = (await aiResponse.json()) as GigaChatResponse;
    return res
      .status(200)
      .json({ rewrittenText: aiData.choices[0].message.content });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: errorMessage });
  }
}
