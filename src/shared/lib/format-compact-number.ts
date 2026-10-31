const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}