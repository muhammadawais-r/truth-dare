import React from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, RotateCcw } from 'lucide-react';
import { ScreenState } from '../types/game';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  inGame: boolean;
  onConfirmQuitGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  inGame,
  onConfirmQuitGame
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => {
            sounds.playButtonTap();
            if (inGame) {
              onConfirmQuitGame();
            } else {
              onNavigate('HOME');
            }
          }}
          className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-md"
        >
          <span className="text-xl font-extrabold tracking-tight text-white">
            Truth <span className="text-pink-500">or</span> <span className="text-cyan-400">Dare</span>
          </span>
        </button>

        {/* Zone 2: Single-line navigation links / screen path */}
        <nav className="hidden sm:flex items-center gap-6 text-xs md:text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              sounds.playButtonTap();
              if (inGame) onConfirmQuitGame();
              else onNavigate('HOME');
            }}
            className={`transition-colors whitespace-nowrap hover:text-white ${currentScreen === 'HOME' ? 'text-white font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => {
              sounds.playButtonTap();
              if (inGame) onConfirmQuitGame();
              else onNavigate('PLAYER_SETUP');
            }}
            className={`transition-colors whitespace-nowrap hover:text-white ${currentScreen === 'PLAYER_SETUP' ? 'text-white font-semibold' : ''}`}
          >
            Players
          </button>
          <button
            onClick={() => {
              sounds.playButtonTap();
              onNavigate('QUESTION_MANAGER');
            }}
            className={`transition-colors whitespace-nowrap hover:text-white ${currentScreen === 'QUESTION_MANAGER' ? 'text-white font-semibold' : ''}`}
          >
            Questions
          </button>
          {inGame && (
            <span className="text-cyan-400 font-semibold whitespace-nowrap">
              Active Game
            </span>
          )}
        </nav>

        {/* Zone 3: Controls */}
        <div className="flex items-center gap-2">
          {inGame && (
            <button
              onClick={() => {
                sounds.playButtonTap();
                onConfirmQuitGame();
              }}
              title="End Game"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">End Game</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playButtonTap();
              onToggleSound();
            }}
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors border border-transparent hover:border-slate-700/50"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors border border-transparent hover:border-slate-700/50"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
