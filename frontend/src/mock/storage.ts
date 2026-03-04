const KEY_PREFIX = 'irs_'
const VERSION_KEY = `${KEY_PREFIX}v`

export function getStorageVersion(): number {
  try {
    const v = localStorage.getItem(VERSION_KEY)
    return v ? parseInt(v, 10) : 0
  } catch {
    return 0
  }
}

export function setStorageVersion(version: number): void {
  try {
    localStorage.setItem(VERSION_KEY, String(version))
  } catch {
    // ignore
  }
}

export function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    if (raw == null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + key)
  } catch {
    // ignore
  }
}

export function clearAll(): void {
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(KEY_PREFIX)) keys.push(k)
    }
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
