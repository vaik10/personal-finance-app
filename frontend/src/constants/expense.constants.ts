const PALETTE = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#F7A44A", "#9B7FD4", "#52B788", "#E9C46A",
  "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A",
];

const colorCache = new Map<string, string>();

export const getCategoryColor = (category: string): string => {
  const key = category.toLowerCase();
  if (colorCache.has(key)) return colorCache.get(key)!;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = PALETTE[Math.abs(hash) % PALETTE.length];
  colorCache.set(key, color);
  return color;
};