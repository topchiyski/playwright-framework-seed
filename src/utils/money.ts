// Demo app (SauceDemo + Restful-Booker). Removed by `npm run init:project`.
/** Extracts the numeric amount from UI text such as `$29.99` or `Item total: $29.99`. */
export function parseMoney(text: string): number {
  const match = /\$\s*(\d+(?:\.\d+)?)/.exec(text);
  if (!match?.[1]) throw new Error(`No money amount found in "${text}"`);
  return Number(match[1]);
}

/** Rounds to cents, avoiding float drift in summed totals. */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatMoney(amount: number): string {
  return `$${roundMoney(amount).toFixed(2)}`;
}
