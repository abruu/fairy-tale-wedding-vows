/** Builds and downloads a single-event .ics file (Apple/Google/Outlook all accept it). */

interface IcsEvent {
  /** Full ISO timestamps with offset, e.g. 2027-08-28T10:30:00+05:30 */
  start: string;
  end: string;
  title: string;
  description: string;
  location: string;
  uid: string;
}

/** Date → 20270828T050000Z */
const toIcsUtc = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** RFC 5545 text escaping */
const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 §3.1: lines longer than 75 octets are folded with CRLF + space. */
function fold(line: string): string {
  const bytes = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (bytes.encode(cur + ch).length > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function buildIcs(e: IcsEvent): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding//Muhurtham//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(e.start)}`,
    `DTEND:${toIcsUtc(e.end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`,
    `LOCATION:${esc(e.location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(e.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}

/** Date → 20270828T050000Z (Google Calendar's date format) */
const toGoogleDate = toIcsUtc;

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac with a touch screen
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = () => /Android/i.test(navigator.userAgent);

/**
 * Adds the event to the visitor's calendar:
 *  - iPhone / iPad: opens the .ics in Safari, which shows Apple's "Add to Calendar" sheet
 *  - Android: opens a Google Calendar link, which hands over to the Calendar app
 *  - desktop: downloads the .ics file (Apple / Google / Outlook all accept it)
 */
export function addToCalendar(e: IcsEvent, filename: string) {
  if (isAndroid()) {
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      dates: `${toGoogleDate(e.start)}/${toGoogleDate(e.end)}`,
      details: e.description,
      location: e.location,
    });
    window.location.href = `https://calendar.google.com/calendar/render?${q.toString()}`;
    return;
  }

  const blob = new Blob([buildIcs(e)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  if (isIOS()) {
    window.location.href = url;
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  // Give the browser a moment to start before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
