import type { Lang } from "./translations";

// en-GB gives "Sunday 15 November 2026" (en-IN inserts a stray comma before the year)
const LOCALE: Record<Lang, string> = { en: "en-GB", ml: "ml-IN" };

/** "2027-08-28" → "Saturday, 28 August 2027" / "2027, ഓഗസ്റ്റ് 28, ശനിയാഴ്‌ച" */
export function formatDate(isoDate: string, lang: Lang, withWeekday = true): string {
  // Noon UTC keeps the calendar day stable in every viewer's timezone.
  const d = new Date(`${isoDate}T12:00:00Z`);
  return d.toLocaleDateString(LOCALE[lang], {
    ...(withWeekday ? { weekday: "long" } : {}),
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * "10:30" → "10:30 AM" / "രാവിലെ 10:30". Times are wall-clock at the venue,
 * so they are formatted as written rather than converted to the viewer's zone.
 */
export function formatTime(hhmm: string, lang: Lang): string {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  if (lang === "en") return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
  const period =
    h >= 4 && h < 12 ? "രാവിലെ" : h >= 12 && h < 15 ? "ഉച്ചയ്ക്ക്" : h >= 15 && h < 19 ? "വൈകുന്നേരം" : "രാത്രി";
  return `${period} ${h12}:${mm}`;
}

/** "10:30"–"11:15" → "10:30 – 11:15 AM" / "രാവിലെ 10:30 – 11:15" (period shown once when shared). */
export function formatTimeRange(start: string, end: string, lang: Lang): string {
  const a = formatTime(start, lang);
  const b = formatTime(end, lang);
  if (lang === "en") {
    const [aTime, aPeriod] = a.split(" ");
    return aPeriod === b.split(" ")[1] ? `${aTime} – ${b}` : `${a} – ${b}`;
  }
  const [aPeriod, aTime] = a.split(" ");
  const [bPeriod, bTime] = b.split(" ");
  return aPeriod === bPeriod ? `${aPeriod} ${aTime} – ${bTime}` : `${a} – ${b}`;
}
