import {
  getEndOfDayCasablancaUTC,
  formatRemaining,
  getCasablancaOffsetMs,
} from "../src/lib/countdown.ts";

// Build a UTC epoch that corresponds to a given Casablanca wall-clock time.
// Casablanca = UTC+1 (no DST), so: true UTC = wallClock - offset.
function mockNowCasablanca(hour: number, minute = 0, second = 0): number {
  const base = Date.UTC(2026, 7, 18, 0, 0, 0); // any stable instant for offset lookup
  const wall = Date.UTC(2026, 7, 18, hour, minute, second);
  return wall - getCasablancaOffsetMs(base);
}

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("PASS:", msg);
}

// 09:00 Casablanca -> ~15h remaining until 00:00 next day
{
  const now = mockNowCasablanca(9, 0, 0);
  const remMs = getEndOfDayCasablancaUTC(now) - now;
  const h = Math.floor(remMs / 3_600_000);
  assert(h === 15, `09:00 -> remaining hours = 15 (got ${h})`);
  assert(
    formatRemaining(remMs) === "15:00:00",
    `09:00 format = 15:00:00 (got ${formatRemaining(remMs)})`,
  );
}

// 18:00 -> 6h remaining
{
  const now = mockNowCasablanca(18, 0, 0);
  const remMs = getEndOfDayCasablancaUTC(now) - now;
  const h = Math.floor(remMs / 3_600_000);
  assert(h === 6, `18:00 -> remaining hours = 6 (got ${h})`);
}

// 23:55 -> 5 minutes remaining
{
  const now = mockNowCasablanca(23, 55, 0);
  const remMs = getEndOfDayCasablancaUTC(now) - now;
  const m = Math.floor(remMs / 60_000);
  assert(m === 5, `23:55 -> remaining minutes = 5 (got ${m})`);
  assert(
    formatRemaining(remMs) === "00:05:00",
    `23:55 format = 00:05:00 (got ${formatRemaining(remMs)})`,
  );
}

// 23:59:59 -> <= 1s remaining
{
  const now = mockNowCasablanca(23, 59, 59);
  const remMs = getEndOfDayCasablancaUTC(now) - now;
  assert(
    remMs <= 1000 && remMs > 0,
    `23:59:59 -> remaining ~<=1s (got ${remMs})`,
  );
}

console.log("All countdown checks passed.");
