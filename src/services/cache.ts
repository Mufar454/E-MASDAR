const PREFIX = 'masdar-cache:';

export function cacheGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; ttl?: number; data: T };
    if (parsed.ttl && Date.now() - parsed.ts > parsed.ttl) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlMs?: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ ts: Date.now(), ttl: ttlMs, data }));
  } catch {
    // storage full or unavailable
  }
}
