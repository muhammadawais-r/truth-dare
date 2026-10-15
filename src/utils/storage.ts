import { PromptItem, GameSettings, Player } from '../types/game';

const KEYS = {
  SAVED_TRUTHS: 'tod_saved_truths_v1',
  SAVED_DARES: 'tod_saved_dares_v1',
  SAVED_PLAYERS: 'tod_saved_players_v1',
  SETTINGS: 'tod_settings_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  reducedMotion: false,
  keepScore: true,
};

export function loadSavedTruths(): PromptItem[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_TRUTHS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && typeof item.text === 'string' && item.text.trim().length > 0);
    }
  } catch (err) {
    console.warn('Failed to parse saved truths from localStorage', err);
  }
  return [];
}

export function saveTruths(items: PromptItem[]): boolean {
  try {
    localStorage.setItem(KEYS.SAVED_TRUTHS, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error('Failed to save truths to localStorage', err);
    return false;
  }
}

export function loadSavedDares(): PromptItem[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_DARES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && typeof item.text === 'string' && item.text.trim().length > 0);
    }
  } catch (err) {
    console.warn('Failed to parse saved dares from localStorage', err);
  }
  return [];
}

export function saveDares(items: PromptItem[]): boolean {
  try {
    localStorage.setItem(KEYS.SAVED_DARES, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error('Failed to save dares to localStorage', err);
    return false;
  }
}

export function clearSavedQuestions(): boolean {
  try {
    localStorage.removeItem(KEYS.SAVED_TRUTHS);
    localStorage.removeItem(KEYS.SAVED_DARES);
    return true;
  } catch (err) {
    console.error('Failed to clear saved lists', err);
    return false;
  }
}

export function loadSavedPlayerNames(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_PLAYERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(name => typeof name === 'string');
    }
  } catch (err) {
    console.warn('Failed to load saved players', err);
  }
  return [];
}

export function savePlayerNames(players: Player[]): void {
  try {
    const names = players.map(p => p.name.trim());
    localStorage.setItem(KEYS.SAVED_PLAYERS, JSON.stringify(names));
  } catch (err) {
    console.warn('Failed to save player names', err);
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : DEFAULT_SETTINGS.reducedMotion,
      keepScore: typeof parsed.keepScore === 'boolean' ? parsed.keepScore : DEFAULT_SETTINGS.keepScore,
    };
  } catch (err) {
    console.warn('Failed to load settings', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings', err);
  }
}
