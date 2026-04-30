import { format, formatDistanceToNow, parseISO } from "date-fns";

export function fmtDate(value: string | Date | null | undefined, fmt = "MMMM d, yyyy") {
  if (!value) return "";
  const d = typeof value === "string" ? parseISO(value) : value;
  return format(d, fmt);
}

export function fmtShortDate(value: string | Date | null | undefined) {
  return fmtDate(value, "MMM d");
}

export function fmtRelative(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? parseISO(value) : value;
  return formatDistanceToNow(d, { addSuffix: true });
}
