export function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function parseIDRInput(value: string): number {
  return parseInt(value.replace(/\./g, '').replace(/[^0-9]/g, ''), 10) || 0;
}

export function formatIDRInput(value: number): string {
  if (!value) return '';
  return new Intl.NumberFormat('id-ID').format(value);
}

export function fractionToString(num: number, den: number): string {
  return `${num}/${den}`;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function simplifyFraction(num: number, den: number): [number, number] {
  const g = gcd(num, den);
  return [num / g, den / g];
}
