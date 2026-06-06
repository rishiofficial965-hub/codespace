import { BrevoClient } from "@getbrevo/brevo";
import { Config } from "../config/dotenv.js";
const brevo = new BrevoClient({
  apiKey: Config.brevoApiKey,
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: html || `<p>${text}</p>`,
      textContent: text,
      sender: {
        name: "codespace",
        email: Config.brevoSenderEmail,
      },
      to: [{ email: to }],
    });

    return result;
  } catch (error) {
    console.error("❌ Brevo Email Error:", error.message);
    throw new Error("Failed to send verification email");
  }
};
