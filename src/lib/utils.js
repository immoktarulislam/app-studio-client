/** Merge conditional class names into one string. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** $45 */
export function formatNumber(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("en-US");
}

/** $45 / hr — used on studio cards */
export function formatRate(value) {
  return `$${formatNumber(value)} / hr`;
}

/** $1,250 — used for totals and deposits */
export function formatMoney(value) {
  return `$${formatNumber(value)}`;
}

/** Nov 12, 2026 */
export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}`.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Today in YYYY-MM-DD (used as the min date on booking forms) */
export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/** "14:00" -> 840 */
export function timeToMinutes(time) {
  if (!time || !time.includes(":")) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Whole hours between two HH:MM times (minimum 1) */
export function hoursBetween(start, end) {
  const diff = timeToMinutes(end) - timeToMinutes(start);
  return Math.max(1, Math.ceil(diff / 60));
}

/** Human readable duration: 3.5 -> "3h 30m" */
export function formatDuration(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Consistent badge styling for booking statuses */
export function statusBadgeClass(status) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
    case "Completed":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-400";
    case "Cancelled":
      return "bg-rose-500/15 text-rose-600 dark:text-rose-400";
    default:
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  }
}

/** Star rendering helper: clamp a rating into whole/half display values */
export function safeRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(5, Math.max(0, n));
}
