/**
 * "Add to calendar" for the betrothal and the wedding.
 *
 * - Apple Calendar / Outlook / anything else: a real .ics file with two
 *   reminders built in (1 day and 2 hours before). The files are emitted at
 *   build time by the `wedding-calendar-files` plugin in vite.config.ts and
 *   served from /calendar/*.ics — iOS Safari only offers "Add to Calendar"
 *   reliably for real files, not for blob downloads.
 * - Google Calendar: its add-event link can't carry reminders, so Google
 *   applies the guest's own default notifications.
 *
 * Relative import (no "@/" alias) on purpose: vite.config.ts imports this
 * file, and the config bundle doesn't resolve app aliases.
 */
import { BRIDE_INVITE_PATH, SITE_URL, WEDDING_CONFIG } from "../config/dates";

export type CalendarEventKey = "betrothal" | "wedding";

export interface CalendarEvent {
  key: CalendarEventKey;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
  /** Root-relative path of the generated .ics file. */
  icsPath: string;
}

/** Reminders written into the .ics files (minutes before the start). */
export const ICS_REMINDERS_MIN = [24 * 60, 120];

const first = (full: string) => full.trim().split(/\s+/)[0] ?? full;

export function getCalendarEvent(key: CalendarEventKey): CalendarEvent {
  const { couple, events, dates } = WEDDING_CONFIG;
  const groom = first(couple.groomName);
  const bride = first(couple.brideName);
  const ev = events[key];
  const startIso = key === "betrothal" ? dates.engagement : dates.wedding;

  // Each family leads with their own: the betrothal is hosted by the bride's
  // side, the wedding by the groom's.
  const title =
    key === "betrothal" ? `Betrothal · ${bride} & ${groom}` : `Wedding · ${groom} & ${bride}`;
  const inviteUrl = key === "betrothal" ? `${SITE_URL}${BRIDE_INVITE_PATH}` : `${SITE_URL}/`;
  const lines = [
    `${key === "betrothal" ? "Betrothal" : "Holy Matrimony"} — ${ev.venue}, ${ev.time}`,
    ev.receptionVenue ? `${ev.receptionLabel ?? "Reception"}: ${ev.receptionVenue}` : "",
    ev.mapsUrl ? `Directions: ${ev.mapsUrl}` : "",
    `Invitation: ${inviteUrl}`,
  ].filter(Boolean);

  return {
    key,
    title,
    start: new Date(startIso),
    end: new Date(ev.calendarEnd),
    location: ev.venue,
    description: lines.join("\n"),
    icsPath: `/calendar/${key}.ics`,
  };
}

/** 20261228T053000Z */
const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** RFC 5545 text escaping. */
const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** RFC 5545 line folding at 75 octets (continuation lines start with a space). */
const fold = (line: string) => {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let curLen = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines carry a leading space
    if (curLen + len > limit) {
      out.push(cur);
      cur = "";
      curLen = 0;
    }
    cur += ch;
    curLen += len;
  }
  out.push(cur);
  return out.join("\r\n ");
};

export function buildIcs(ev: CalendarEvent, stamp: Date = new Date()): string {
  const host = new URL(SITE_URL).host.replace(/^www\./, "");
  const alarms = ICS_REMINDERS_MIN.flatMap((min) => [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`${ev.title} — ${min >= 1440 ? "tomorrow" : `in ${min / 60} hours`}`)}`,
    `TRIGGER:-PT${min}M`,
    "END:VALARM",
  ]);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${host}//Invitation//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.key}-${utcStamp(ev.start)}@${host}`,
    `DTSTAMP:${utcStamp(stamp)}`,
    `DTSTART:${utcStamp(ev.start)}`,
    `DTEND:${utcStamp(ev.end)}`,
    `SUMMARY:${esc(ev.title)}`,
    `LOCATION:${esc(ev.location)}`,
    `DESCRIPTION:${esc(ev.description)}`,
    `URL:${SITE_URL}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    ...alarms,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${utcStamp(ev.start)}/${utcStamp(ev.end)}`,
    details: ev.description,
    location: ev.location,
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
