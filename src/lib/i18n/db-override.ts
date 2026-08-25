/**
 * DB-override helpers for i18n.
 * Client-safe (no server-only import) — used by context.tsx (client) and seed script (Node).
 */

/** Recursively flatten a nested object to dot-path → leaf-string pairs. */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      result[path] = v;
    } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flattenObject(v as Record<string, unknown>, path));
    }
  }
  return result;
}

/** Set a dot-path value into a plain mutable Record. Internal helper. */
function setPath(obj: Record<string, unknown>, segments: string[], value: string): void {
  if (segments.length === 0) return;
  const head = segments[0];
  const rest = segments.slice(1);
  if (rest.length === 0) {
    obj[head] = value;
    return;
  }
  if (typeof obj[head] !== 'object' || obj[head] === null) {
    obj[head] = {};
  }
  setPath(obj[head] as Record<string, unknown>, rest, value);
}

/**
 * Merge DB overrides onto a base translation object.
 *
 * @param base  - Compile-time TypeScript locale object (source of truth fallback).
 * @param flat  - Flat map of "namespace.sub.key" → value loaded from the DB.
 * @returns     New object with DB values replacing matching paths; base is never mutated.
 *              On any error returns base unchanged (zero regression guarantee).
 */
export function applyDbOverrides<T extends object>(base: T, flat: Record<string, string>): T {
  try {
    if (Object.keys(flat).length === 0) return base;
    const clone = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
    for (const [dotPath, value] of Object.entries(flat)) {
      const segments = dotPath.split('.');
      // dot-path must have at least 2 segments (namespace + key)
      if (segments.length < 2) continue;
      setPath(clone, segments, value);
    }
    return clone as T;
  } catch {
    // Non-fatal: any parse/set error -> fall back to unmodified TS object.
    return base;
  }
}
