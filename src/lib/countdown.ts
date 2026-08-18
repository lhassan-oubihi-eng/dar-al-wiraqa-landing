// Pure, framework-free helpers for the daily (end-of-today) offer countdown.
// Morocco uses Africa/Casablanca (UTC+1, no DST). The offer ends at local
// midnight Casablanca time, computed live from the visitor's clock.

export function getCasablancaOffsetMs(date: number): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Casablanca",
    timeZoneName: "shortOffset",
  });
  const name =
    dtf.formatToParts(date).find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const match = name.match(/GMT([+-]\d+)/);
  const hours = match ? parseInt(match[1], 10) : 1;
  return hours * 3_600_000;
}

// Returns the absolute UTC epoch (ms) at which "today" ends in Casablanca.
export function getEndOfDayCasablancaUTC(now: number): number {
  const offset = getCasablancaOffsetMs(now);
  const cas = new Date(now + offset);
  const y = cas.getUTCFullYear();
  const m = cas.getUTCMonth();
  const d = cas.getUTCDate();
  // Tomorrow 00:00 in Casablanca wall-clock, encoded as if it were UTC...
  const tomorrowMidCasWall = Date.UTC(y, m, d + 1, 0, 0, 0);
  // ...then shift back by the offset to get the true UTC instant.
  return tomorrowMidCasWall - offset;
}

export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
