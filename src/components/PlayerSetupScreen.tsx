import React, { useState } from 'react';
import { Users, Plus, Minus, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Player, PLAYER_COLORS } from '../types/game';
import { sounds } from '../utils/audio';

interface PlayerSetupScreenProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  players,
  onUpdatePlayers,
  onContinue,
  onBack,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const playerCount = players.length;

  const handleSetCount = (newCount: number) => {
    if (newCount < 2 || newCount > 10) return;
    sounds.playButtonTap();

    if (newCount > playerCount) {
      const added: Player[] = [];
      for (let i = playerCount; i < newCount; i++) {
        const colorPair = PLAYER_COLORS[i % PLAYER_COLORS.length];
        added.push({
          id: 'player_' + (i + 1) + '_' + Date.now(),
          name: `Player ${i + 1}`,
          color: colorPair.color,
          accentColor: colorPair.accentColor,
        });
      }
      onUpdatePlayers([...players, ...added]);
    } else if (newCount < playerCount) {
      onUpdatePlayers(players.slice(0, newCount));
    }
    setErrorMsg(null);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...players];
    updated[index] = {
      ...updated[index],
      name: newName,
    };
    onUpdatePlayers(updated);
    setErrorMsg(null);
  };

  const handleValidateAndContinue = () => {
    // Check for empty or whitespace-only names
    const emptyIndex = players.findIndex(p => !p.name || p.name.trim().length === 0);
    if (emptyIndex !== -1) {
      setErrorMsg(`Player ${emptyIndex + 1} needs a name.`);
      sounds.playButtonTap();
      return;
    }

    if (players.length < 2) {
      setErrorMsg('At least 2 players are required.');
      return;
    }

    sounds.playButtonTap();
    onContinue();
  };

  // Check if there are any duplicate names so we can inform the user
  const names = players.map(p => p.name.trim().toLowerCase());
  const hasDuplicates = names.some((n, i) => names.indexOf(n) !== i);

  return (
    <div className="py-6 sm:py-10 px-4 max-w-2xl mx-auto w-full">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Step 1 of 2 · Players
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Who is Playing?
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose 2 to 10 players and customize names for the spinner.
        </p>
      </div>

      {/* Player Count Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white block">Number of Players</span>
            <span className="text-xs text-slate-400">Between 2 and 10 players</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSetCount(playerCount - 1)}
              disabled={playerCount <= 2}
              aria-label="Decrease player count"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 flex items-center justify-center text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center text-xl font-bold font-mono text-cyan-400">
              {playerCount}
            </span>

            <button
              onClick={() => handleSetCount(playerCount + 1)}
              disabled={playerCount >= 10}
              aria-label="Increase player count"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 flex items-center justify-center text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick count chips for instant picking */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-800/80">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(cnt => (
            <button
              key={cnt}
              onClick={() => handleSetCount(cnt)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                playerCount === cnt
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate warning note if duplicate names present */}
      {hasDuplicates && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Some players share identical names. They are clearly identified by their player numbers (e.g. #1, #2) on the spinner.
          </span>
        </div>
      )}

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Player Names Input Grid */}
      <div className="space-y-3 mb-8">
        {players.map((player, idx) => (
          <div
            key={player.id || idx}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 focus-within:border-slate-700 transition-colors"
          >
            {/* Color swatch badge */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm shrink-0"
              style={{ backgroundColor: player.color }}
            >
              #{idx + 1}
            </div>

            <div className="flex-1">
              <label htmlFor={`player-input-${idx}`} className="sr-only">
                Player {idx + 1} Name
              </label>
              <input
                id={`player-input-${idx}`}
                type="text"
                maxLength={24}
                value={player.name}
                onChange={(e) => handleNameChange(idx, e.target.value)}
                placeholder={`Player ${idx + 1}`}
                className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Sector {idx + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onBack();
          }}
          className="flex-1 px-5 py-3 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={handleValidateAndContinue}
          className="flex-2 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-[0.98] rounded-xl shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
        >
          <span>Continue to Questions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
