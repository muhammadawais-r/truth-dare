import React from 'react';
import { FileQuestion, Flame } from 'lucide-react';
import { Player, PromptType } from '../types/game';
import { sounds } from '../utils/audio';

interface ChoiceScreenProps {
  player: Player;
  onSelectChoice: (type: PromptType) => void;
  truthCount: number;
  dareCount: number;
}

export const ChoiceScreen: React.FC<ChoiceScreenProps> = ({
  player,
  onSelectChoice,
  truthCount,
  dareCount
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 px-4 max-w-xl mx-auto w-full">
      {/* Player Identity Badge */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <span className="font-semibold text-white">{player.name}</span>
          <span className="text-slate-500">is on the hot seat</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What Will You Choose?
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Make your choice wisely. Will you reveal a hidden truth or brave a daring challenge?
        </p>
      </div>

      {/* Two Prominent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* TRUTH Card */}
        <button
          onClick={() => {
            sounds.playTruthTone();
            onSelectChoice('truth');
          }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border-2 border-cyan-500/30 hover:border-cyan-400 hover:from-cyan-950/60 active:scale-[0.98] transition-all shadow-xl shadow-cyan-950/20 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileQuestion className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-cyan-400 tracking-wide mb-1">
            TRUTH
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Answer an honest, revealing question from the group.
          </p>

          <span className="text-xs text-cyan-300/80 font-mono">
            {truthCount} {truthCount === 1 ? 'question' : 'questions'} available
          </span>
        </button>

        {/* DARE Card */}
        <button
          onClick={() => {
            sounds.playDareTone();
            onSelectChoice('dare');
          }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-pink-950/40 to-slate-900 border-2 border-pink-500/30 hover:border-pink-400 hover:from-pink-950/60 active:scale-[0.98] transition-all shadow-xl shadow-pink-950/20 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-400/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Flame className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-pink-400 tracking-wide mb-1">
            DARE
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Perform an exciting, hilarious challenge in front of everyone.
          </p>

          <span className="text-xs text-pink-300/80 font-mono">
            {dareCount} {dareCount === 1 ? 'challenge' : 'challenges'} available
          </span>
        </button>
      </div>
    </div>
  );
};
