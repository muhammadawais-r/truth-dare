import React from 'react';
import { Play, ListChecks, Users, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HomeScreenProps {
  onPlayNow: () => void;
  onManageQuestions: () => void;
  savedTruthCount: number;
  savedDareCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayNow,
  onManageQuestions,
  savedTruthCount,
  savedDareCount,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 px-4 max-w-4xl mx-auto w-full">
      {/* Visual Identity Hero */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-slate-700/60 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm">
              ?
            </span>
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm">
              🔥
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Truth <span className="text-pink-500">or</span> <span className="text-cyan-400">Dare</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-balance">
          A modern party game built for friends sharing one device. No accounts, no ads, and no setup friction—just pass the phone, spin the wheel, and discover the truth.
        </p>

        {/* Metadata stats unboxed according to zero-pill rules */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 pt-1">
          <span>2–10 Players</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Single Device Pass & Play</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Custom Lists</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full max-w-md">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onPlayNow();
          }}
          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 active:scale-[0.98] rounded-xl shadow-lg shadow-indigo-900/30 border border-pink-400/30 transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Play Now</span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            onManageQuestions();
          }}
          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.98] rounded-xl border border-slate-700/80 transition-all cursor-pointer"
        >
          <ListChecks className="w-5 h-5 text-cyan-400" />
          <span>Manage Questions</span>
        </button>
      </div>

      {/* Saved question status indicator */}
      {(savedTruthCount > 0 || savedDareCount > 0) && (
        <div className="mt-4 text-xs text-slate-400 text-center">
          <span>Saved collection ready: </span>
          <strong className="text-cyan-400 font-medium">{savedTruthCount} truths</strong>
          <span className="text-slate-600"> & </span>
          <strong className="text-pink-400 font-medium">{savedDareCount} dares</strong>
        </div>
      )}

      {/* How It Works Grid */}
      <div className="mt-14 w-full border-t border-slate-800/80 pt-10">
        <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 text-center mb-6">
          How To Play in 4 Simple Steps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Add Players</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose 2 to 10 players and type custom names. Each player gets an assigned slice on the wheel.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Prepare Lists</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create your own questions and dares. Save them for next time or play a temporary session.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Spin The Wheel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tap Spin! The fair animated wheel decelerates smoothly to pick the next player with equal odds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              4
            </div>
            <h3 className="text-sm font-bold text-white">Truth or Dare</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick Truth or Dare. Swap a prompt if you wish, answer honestly, and pass the device along!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
