export const ICON_ID_SEPARATOR = ":";

export function isReactIconId(value: string): boolean {
  return value.includes(ICON_ID_SEPARATOR);
}

export function parseIconId(value: string): { pack: string; name: string } {
  const idx = value.indexOf(ICON_ID_SEPARATOR);
  if (idx === -1) {
    throw new Error(`Invalid icon id: ${value}`);
  }
  return { pack: value.slice(0, idx), name: value.slice(idx + 1) };
}

export function formatIconId(pack: string, name: string): string {
  return `${pack}${ICON_ID_SEPARATOR}${name}`;
}
