import React, { useState } from 'react';
import { 
  X, Volume2, VolumeX, Zap, ZapOff, Trash2, 
  Home, Check, Trophy 
} from 'lucide-react';
import { GameSettings, Player, PlayerScore } from '../types/game';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClearSavedLists: () => void;
  onExitToHome: () => void;
  inGame: boolean;
  players: Player[];
  scores: Record<string, PlayerScore>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearSavedLists,
  onExitToHome,
  inGame,
  players,
  scores,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'scoreboard'>('settings');

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sounds.enabled = nextVal;
    if (nextVal) sounds.playWinChime();
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
  };

  const handleToggleReducedMotion = () => {
    sounds.playButtonTap();
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
  };

  const handleToggleKeepScore = () => {
    sounds.playButtonTap();
    onUpdateSettings({ ...settings, keepScore: !settings.keepScore });
  };

  const handleConfirmClear = () => {
    sounds.playButtonTap();
    onClearSavedLists();
    setConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playButtonTap();
                setActiveTab('settings');
              }}
              className={`text-sm font-bold pb-0.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Settings
            </button>
            {inGame && (
              <button
                onClick={() => {
                  sounds.playButtonTap();
                  setActiveTab('scoreboard');
                }}
                className={`text-sm font-bold pb-0.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'scoreboard'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Scoreboard
              </button>
            )}
          </div>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'settings' ? (
          <div className="py-4 space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Sound Effects</span>
                  <span className="text-xs text-slate-400">Spin ticks, chimes & tap sounds</span>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
                  {settings.reducedMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Fast Spin (Reduced Motion)</span>
                  <span className="text-xs text-slate-400">Shortens wheel animation</span>
                </div>
              </div>

              <button
                onClick={handleToggleReducedMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.reducedMotion ? 'bg-amber-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Keep Score Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Score Tracking</span>
                  <span className="text-xs text-slate-400">Track finished turns & skips</span>
                </div>
              </div>

              <button
                onClick={handleToggleKeepScore}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.keepScore ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.keepScore ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Clear Saved Lists with Confirmation */}
            <div className="pt-2 border-t border-slate-800">
              {confirmClear ? (
                <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800/80 space-y-2">
                  <p className="text-xs text-red-200">
                    Are you sure you want to permanently clear all saved Truth and Dare questions from browser storage?
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmClear}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
                    >
                      Yes, Clear Saved Data
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:bg-red-950/20 hover:border-red-900/40 text-slate-400 hover:text-red-400 transition-colors text-xs font-semibold cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Saved Question Lists</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Reset storage</span>
                </button>
              )}
            </div>

            {/* In-Game Exit Option */}
            {inGame && (
              <button
                onClick={() => {
                  sounds.playButtonTap();
                  onExitToHome();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Exit Current Game & Return Home</span>
              </button>
            )}
          </div>
        ) : (
          /* Scoreboard View */
          <div className="py-4 space-y-3">
            <p className="text-xs text-slate-400">
              Completed challenges and truths across current session:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {players.map((p) => {
                const s = scores[p.id] || { completed: 0, skipped: 0 };
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-sm font-bold text-white">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-mono font-semibold">
                        {s.completed} completed
                      </span>
                      {s.skipped > 0 && (
                        <span className="text-slate-500 font-mono">
                          {s.skipped} skipped
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
