export type PromptType = 'truth' | 'dare' | 'wildcard';

export type ListMode = 'saved' | 'temporary';

export type WildcardCategory = 'truth' | 'dare' | 'twist';

export interface WildcardPrompt {
  id: string;
  category: WildcardCategory;
  title: string;
  text: string;
  badge: string;
}

export interface PromptItem {
  id: string;
  text: string;
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  accentColor: string;
}

export type ScreenState = 
  | 'HOME'
  | 'PLAYER_SETUP'
  | 'QUESTION_MANAGER'
  | 'SPINNER'
  | 'CHOICE'
  | 'PROMPT_DISPLAY'
  | 'WILDCARD_SELECT';

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  keepScore: boolean;
}

export interface PlayerScore {
  completed: number;
  skipped: number;
}

export interface GameSession {
  players: Player[];
  selectedPlayerIndex: number | null;
  currentPromptType: PromptType | null;
  currentPrompt: PromptItem | null;
  truthList: PromptItem[];
  dareList: PromptItem[];
  unusedTruthIds: string[];
  unusedDareIds: string[];
  turnCount: number;
  listMode: ListMode;
  scores: Record<string, PlayerScore>;
}

export const PLAYER_COLORS: { color: string; accentColor: string }[] = [
  { color: '#22D3EE', accentColor: '#06B6D4' }, // Luminous Cyan
  { color: '#C084FC', accentColor: '#A855F7' }, // Radiant Violet
  { color: '#FBBF24', accentColor: '#F59E0B' }, // Bright Amber Gold
  { color: '#F472B6', accentColor: '#EC4899' }, // Neon Vivid Pink
  { color: '#34D399', accentColor: '#10B981' }, // Bright Mint Emerald
  { color: '#FB7185', accentColor: '#F43F5E' }, // Bright Neon Coral
  { color: '#38BDF8', accentColor: '#0284C7' }, // Electric Sky Blue
  { color: '#A3E635', accentColor: '#84CC16' }, // High-Vis Lime
  { color: '#818CF8', accentColor: '#6366F1' }, // Electric Indigo
  { color: '#FB923C', accentColor: '#EA580C' }, // Vivid Tangerine Orange
];
