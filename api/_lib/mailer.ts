import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD env var is not set");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

export async function sendOtpEmail(
  to: string,
  code: string,
  firstName: string,
) {
  const from = process.env.GMAIL_FROM || process.env.GMAIL_USER;
  const appName = process.env.APP_NAME || "Messenger";

  const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
            <h2 style="margin: 0 0 16px; font-size: 22px;">Привет, ${escapeHtml(firstName)}!</h2>
            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5;">
                Ваш код подтверждения для регистрации в <b>${escapeHtml(appName)}</b>:
            </p>
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 20px; background: #f4f4f6; border-radius: 12px; margin-bottom: 24px;">
                ${code}
            </div>
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">
                Код действителен 10 минут.
            </p>
            <p style="margin: 0; font-size: 13px; color: #666;">
                Если вы не запрашивали регистрацию, просто проигнорируйте это письмо.
            </p>
        </div>
    `;

  await getTransporter().sendMail({
    from: `"${appName}" <${from}>`,
    to,
    subject: `Код подтверждения: ${code}`,
    text: `Ваш код подтверждения: ${code}. Действителен 10 минут.`,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, code: string) {
  const from = process.env.GMAIL_FROM || process.env.GMAIL_USER;
  const appName = process.env.APP_NAME || "Messenger";

  const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
            <h2 style="margin: 0 0 16px; font-size: 22px;">Сброс пароля</h2>
            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5;">
                Кто-то запросил смену пароля для вашего аккаунта в <b>${escapeHtml(appName)}</b>. Ваш код подтверждения:
            </p>
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 20px; background: #f4f4f6; border-radius: 12px; margin-bottom: 24px;">
                ${code}
            </div>
            <p style="margin: 0 0 8px; font-size: 13px; color: #666;">
                Код действителен 10 минут.
            </p>
            <p style="margin: 0; font-size: 13px; color: #666;">
                Если это были не вы, проигнорируйте письмо, пароль останется прежним.
            </p>
        </div>
    `;

  await getTransporter().sendMail({
    from: `"${appName}" <${from}>`,
    to,
    subject: `Код для смены пароля: ${code}`,
    text: `Код для смены пароля: ${code}. Действителен 10 минут. Если это были не вы — проигнорируйте письмо.`,
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
