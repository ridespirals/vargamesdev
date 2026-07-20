const STORAGE_KEY = 'jumper.devSettings';

export type DevSettings = {
  /** Scroll world; player has no gravity or collision. */
  clipping: boolean;
  /** No gaps or obstacles. */
  flatland: boolean;
  /** Skip Game Over; auto-restart Play. */
  forever: boolean;
};

export const DEFAULT_DEV_SETTINGS: DevSettings = {
  clipping: false,
  flatland: false,
  forever: false,
};

type Listener = (settings: DevSettings) => void;

let settings: DevSettings = loadSettings();
const listeners = new Set<Listener>();

function loadSettings(): DevSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_DEV_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<DevSettings>;
    return {
      clipping: Boolean(parsed.clipping),
      flatland: Boolean(parsed.flatland),
      forever: Boolean(parsed.forever),
    };
  } catch {
    return { ...DEFAULT_DEV_SETTINGS };
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function notify(): void {
  for (const listener of listeners) {
    listener(settings);
  }
}

export function getDevSettings(): DevSettings {
  return settings;
}

export function setDevSetting<K extends keyof DevSettings>(
  key: K,
  value: DevSettings[K],
): void {
  if (settings[key] === value) {
    return;
  }
  settings = { ...settings, [key]: value };
  persist();
  notify();
}

export function subscribeDevSettings(listener: Listener): () => void {
  listeners.add(listener);
  listener(settings);
  return () => listeners.delete(listener);
}
