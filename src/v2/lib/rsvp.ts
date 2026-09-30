import emailjs from "@emailjs/browser";
import { WEDDING_CONFIG } from "@/config/dates";
import { couplePeople } from "./couple";
import { formatDate, formatTime } from "./format";

export interface RsvpData {
  name: string;
  message: string;
}

export type RsvpResult = "ok" | "error" | "not-configured";

/**
 * Sends the RSVP through EmailJS using WEDDING_CONFIG.email. The template
 * variables match the previous site's template, so the existing EmailJS
 * template keeps working unchanged.
 */
export async function submitRsvp(data: RsvpData): Promise<RsvpResult> {
  const { serviceId, templateId, publicKey } = WEDDING_CONFIG.email.emailJS;
  if (!serviceId || !templateId || !publicKey) return "not-configured";

  const recipients = WEDDING_CONFIG.email.recipientEmails.filter(Boolean).join(", ");
  const [a, b] = couplePeople("en");

  try {
    const res = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: recipients,
        reply_to: recipients,
        from_name: data.name,
        message: data.message || "No message provided",
        couple_names: `${a.nameEn} & ${b.nameEn}`,
        wedding_date: `${formatDate(WEDDING_CONFIG.weddingDate, "en")}, ${formatTime(WEDDING_CONFIG.muhurthamTime, "en")}`,
      },
      { publicKey },
    );
    return res.status === 200 ? "ok" : "error";
  } catch {
    return "error";
  }
}
