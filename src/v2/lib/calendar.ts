/** Builds a single-event .ics file and links to Google Calendar (Apple/Google/Outlook all accept it). */

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

/** Google Calendar web link: the desktop route, and the fallback when no calendar app handles the intent. */
function googleCalendarUrl(e: IcsEvent) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${toGoogleDate(e.start)}/${toGoogleDate(e.end)}`,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/**
 * Android calendar-insert intent (Chrome supports it): opens the phone's own Calendar app
 * on a pre-filled new-event screen, one tap from Save. Falls back to the Google Calendar page.
 */
function androidIntentUrl(e: IcsEvent) {
  const enc = encodeURIComponent;
  return (
    "intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/event;" +
    `S.title=${enc(e.title)};` +
    `S.description=${enc(e.description)};` +
    `S.eventLocation=${enc(e.location)};` +
    `l.beginTime=${new Date(e.start).getTime()};` +
    `l.endTime=${new Date(e.end).getTime()};` +
    `S.browser_fallback_url=${enc(googleCalendarUrl(e))};end`
  );
}

/**
 * Adds the event to the visitor's calendar:
 *  - iPhone / iPad: opens the .ics in Safari, which shows Apple's "Add to Calendar" sheet
 *  - Android: opens the Calendar app's new-event screen (Save to keep it)
 *  - desktop: opens Google Calendar's "new event" page in a new tab
 */
export function addToCalendar(e: IcsEvent) {
  if (isIOS()) {
    const url = URL.createObjectURL(new Blob([buildIcs(e)], { type: "text/calendar;charset=utf-8" }));
    window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else if (isAndroid()) {
    window.location.href = androidIntentUrl(e);
  } else {
    window.open(googleCalendarUrl(e), "_blank", "noopener");
  }
}
