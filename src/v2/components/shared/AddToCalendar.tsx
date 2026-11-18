import React, { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, ChevronDown } from "lucide-react";
import {
  getCalendarEvent,
  googleCalendarUrl,
  type CalendarEventKey,
} from "@/lib/calendar";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * "Add to calendar" chip for an event card. Opens in place (not a floating
 * popover — the ticket card clips overflow) into three choices:
 *   Google Calendar — template link; Google applies the guest's own default
 *                     reminders (its links can't carry reminders).
 *   Apple Calendar  — the generated .ics, with reminders 1 day + 2 hours before.
 *   Outlook / other — same .ics, offered as a download.
 */
export const AddToCalendar: React.FC<{ event: CalendarEventKey }> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const menuId = useId();
  const ev = useMemo(() => getCalendarEvent(event), [event]);

  const options = [
    {
      label: "Google Calendar",
      note: "Uses your usual reminders",
      href: googleCalendarUrl(ev),
      external: true,
    },
    {
      label: "Apple Calendar",
      note: "Reminds 1 day & 2 hours before",
      href: ev.icsPath,
    },
    {
      label: "Outlook / other",
      note: "Download .ics · reminders included",
      href: ev.icsPath,
      download: `${event}.ics`,
    },
  ];

  return (
    <div className="v2-cal">
      <button
        type="button"
        className={`v2-map-link v2-cal-toggle ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <CalendarPlus size={12} strokeWidth={2} aria-hidden="true" />
        <span>Add to calendar</span>
        <ChevronDown size={12} strokeWidth={2} className="v2-cal-chevron" aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={menuId}
            className="v2-cal-menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((o, i) => (
              <motion.li
                key={o.label}
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: reduced ? 0 : 0.05 + i * 0.05 }}
              >
                <a
                  className="v2-cal-option"
                  href={o.href}
                  {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(o.download ? { download: o.download } : {})}
                  onClick={() => setOpen(false)}
                >
                  <span className="v2-cal-option-label">{o.label}</span>
                  <span className="v2-cal-option-note">{o.note}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
