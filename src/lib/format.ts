/**
 * Deterministic number grouping — identical on the server and in the browser.
 * `toLocaleString()` differs between the SSR runtime and the user's browser,
 * which produced React hydration mismatches on price labels.
 */
export function formatDZ(n: number) {
  const rounded = Math.round(n);
  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const DZD = "دج";
