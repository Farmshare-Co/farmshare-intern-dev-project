export const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtInt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}