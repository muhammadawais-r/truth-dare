import React from 'react';
import { FileQuestion, Flame, Sparkles } from 'lucide-react';
import { Player, PromptType } from '../types/game';
import { sounds } from '../utils/audio';

interface ChoiceScreenProps {
  player: Player;
  onSelectChoice: (type: PromptType) => void;
  truthCount: number;
  dareCount: number;
  wildcardRemainingCount?: number;
}

export const ChoiceScreen: React.FC<ChoiceScreenProps> = ({
  player,
  onSelectChoice,
  truthCount,
  dareCount,
  wildcardRemainingCount = 60,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4 max-w-4xl mx-auto w-full select-none">
      {/* Player Identity Badge */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-md">
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
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Reveal a truth, brave a daring challenge, or test your luck with 6 mystery cards!
        </p>
      </div>

      {/* Three Prominent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {/* TRUTH Card */}
        <button
          onClick={() => {
            sounds.playTruthTone();
            onSelectChoice('truth');
          }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900 border-2 border-cyan-500/30 hover:border-cyan-400 hover:from-cyan-950/60 active:scale-[0.98] transition-all shadow-xl shadow-cyan-950/20 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <FileQuestion className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <h3 className="text-2xl font-black text-cyan-400 tracking-wide mb-1">
            TRUTH
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
            Answer an honest, revealing question from your group&rsquo;s list.
          </p>

          <span className="text-xs text-cyan-300/80 font-mono">
            {truthCount} {truthCount === 1 ? 'question' : 'questions'}
          </span>
        </button>

        {/* DARE Card */}
        <button
          onClick={() => {
            sounds.playDareTone();
            onSelectChoice('dare');
          }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-pink-950/40 via-slate-900/90 to-slate-900 border-2 border-pink-500/30 hover:border-pink-400 hover:from-pink-950/60 active:scale-[0.98] transition-all shadow-xl shadow-pink-950/20 cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-400/40 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Flame className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <h3 className="text-2xl font-black text-pink-400 tracking-wide mb-1">
            DARE
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
            Perform an exciting, hilarious challenge in front of everyone.
          </p>

          <span className="text-xs text-pink-300/80 font-mono">
            {dareCount} {dareCount === 1 ? 'challenge' : 'challenges'}
          </span>
        </button>

        {/* WILDCARD Card */}
        <button
          onClick={() => {
            sounds.playWildcardTone();
            onSelectChoice('wildcard');
          }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-purple-950/50 via-slate-900/90 to-slate-900 border-2 border-purple-500/40 hover:border-amber-400 hover:from-purple-950/70 active:scale-[0.98] transition-all shadow-xl shadow-purple-950/30 cursor-pointer"
        >
          {/* New / Mystery Tag */}
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-[10px] font-black tracking-wider text-slate-950 shadow-md uppercase">
            6 Mystery Cards
          </div>

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 text-amber-300 border border-purple-400/50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
          </div>

          <h3 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent tracking-wide mb-1">
            WILDCARD
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
            Pick 1 of 6 face-down mystery cards! Contains surprise twists, truths, or dares.
          </p>

          <span className="text-xs text-purple-300/80 font-mono">
            {wildcardRemainingCount} unseen in deck
          </span>
        </button>
      </div>
    </div>
  );
};
