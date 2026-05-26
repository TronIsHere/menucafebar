export function generateTableNumbers(count: number): string[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => String(i + 1));
}

export function getTableCount(tableNumbers: string[]): number {
  return tableNumbers.length;
}
