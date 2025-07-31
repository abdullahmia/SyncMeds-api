export function generateCacheKeys(query: Record<string, any>): string {
  return Object.entries(query)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      const stringValue = String(value)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      return `${key}:${stringValue}`;
    })
    .join(":");
}
