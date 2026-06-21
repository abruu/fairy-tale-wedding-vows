import emailjs from "@emailjs/browser";
import { WEDDING_CONFIG } from "@/config/dates";

export interface WishEmailData {
  name: string;
  message: string;
}

/**
 * Send wedding wish email using EmailJS
 * @param data - The wish data containing name and message
 * @returns Promise that resolves when email is sent
 */
export const sendWishEmail = async (data: WishEmailData): Promise<void> => {
  const { serviceId, templateId, publicKey } = WEDDING_CONFIG.email.emailJS;

  // Validate configuration
  if (
    !serviceId ||
    !templateId ||
    !publicKey ||
    publicKey === "YOUR_PUBLIC_KEY"
  ) {
    throw new Error(
      "EmailJS is not configured. Please set up your EmailJS credentials in dates.ts",
    );
  }

  // Get recipient emails (join multiple emails with comma for EmailJS)
  const recipientEmails = Array.isArray(WEDDING_CONFIG.email.recipientEmails)
    ? WEDDING_CONFIG.email.recipientEmails.join(", ")
    : WEDDING_CONFIG.email.recipientEmails;

  // Prepare template parameters
  const templateParams = {
    to_email: recipientEmails,
    from_name: data.name,
    message: data.message || "No message provided",
    couple_names: WEDDING_CONFIG.couple.displayNames,
    wedding_date: WEDDING_CONFIG.events.wedding.dateLabel,
    reply_to: recipientEmails,
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey,
    );

    if (response.status !== 200) {
      throw new Error(`Email sending failed with status: ${response.status}`);
    }

    console.log("✅ Wedding wish email sent successfully!", response);
  } catch (error) {
    console.error("❌ Failed to send wedding wish email:", error);
    throw error;
  }
};
