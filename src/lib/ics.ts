import { weddingConfig } from "@/data/weddingConfig";

const pad = (value: number) => String(value).padStart(2, "0");

function toIcsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export type IcsLabels = {
  title: string;
  description: string;
  alarmDay: string;
  alarmHours: string;
};

/** Membuat file .ics (Akad 09.00 WIB s/d Resepsi 16.00 WIB) lalu mengunduhnya. */
export function downloadWeddingIcs(labels: IcsLabels) {
  const start = new Date(weddingConfig.event.weddingDate);
  const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WebNikahan Premium//Dimas & Intan//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:dimas-intan-wedding-20261206@webnikahan",
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(labels.title)}`,
    `DESCRIPTION:${escapeText(labels.description)}`,
    `LOCATION:${escapeText(
      `${weddingConfig.event.venueName}, ${weddingConfig.event.venueAddress}`,
    )}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(labels.alarmDay)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(labels.alarmHours)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "dimas-intan-06-12-2026.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
