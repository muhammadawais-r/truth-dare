import React, { useState, useEffect, useRef } from 'react';
import { 
  FileQuestion, Flame, Shuffle, ArrowRight, 
  CheckCircle2, XCircle, Info, Square, Sparkles
} from 'lucide-react';
import { Player, PromptItem, PromptType } from '../types/game';
import { sounds } from '../utils/audio';

interface PromptDisplayScreenProps {
  player: Player;
  promptType: PromptType;
  currentPrompt: PromptItem;
  promptList: PromptItem[];
  totalPromptsCount: number;
  hasAlternativePrompt: boolean;
  onChangePrompt: () => void;
  onNextTurn: (completed: boolean) => void;
  keepScore: boolean;
}

export const PromptDisplayScreen: React.FC<PromptDisplayScreenProps> = ({
  player,
  promptType,
  currentPrompt,
  promptList,
  totalPromptsCount,
  hasAlternativePrompt,
  onChangePrompt,
  onNextTurn,
  keepScore,
}) => {
  const [isRolling, setIsRolling] = useState(true);
  const [rollingIndex, setRollingIndex] = useState(0);
  const [showSingleItemNotice, setShowSingleItemNotice] = useState(false);
  const [justRevealed, setJustRevealed] = useState(false);

  const isTruth = promptType === 'truth';
  const tickCounterRef = useRef(0);

  // Continuous scrolling interval
  useEffect(() => {
    if (!isRolling || promptList.length <= 1) {
      if (promptList.length <= 1) {
        setIsRolling(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setRollingIndex(prev => (prev + 1) % promptList.length);
      tickCounterRef.current += 1;
      // Play tick every 2 steps to keep audio crisp and pleasant
      if (tickCounterRef.current % 2 === 0) {
        sounds.playSpinTick(750 + (tickCounterRef.current % 5) * 50);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [isRolling, promptList]);

  const handleStopRoll = () => {
    sounds.playWinChime();
    setIsRolling(false);
    setJustRevealed(true);
    setTimeout(() => setJustRevealed(false), 800);
  };

  const handleChangeClick = () => {
    if (!hasAlternativePrompt) {
      setShowSingleItemNotice(true);
      sounds.playButtonTap();
      return;
    }
    sounds.playReroll();
    onChangePrompt();
    setShowSingleItemNotice(false);
    setIsRolling(true);
  };

  // Text to show during rolling vs final revealed state
  const displayedPrompt = isRolling
    ? promptList[rollingIndex] || currentPrompt
    : currentPrompt;

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8 px-4 max-w-xl mx-auto w-full select-none">
      {/* Player Header */}
      <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-md">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: player.color }}
        />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {player.name}&rsquo;s {isTruth ? 'Truth' : 'Dare'}
        </span>
      </div>

      {/* Prompt Card */}
      <div
        className={`w-full min-h-[280px] sm:min-h-[320px] flex flex-col justify-between p-6 sm:p-8 rounded-3xl border-2 shadow-2xl relative overflow-hidden transition-all ${
          isTruth
            ? isRolling
              ? 'bg-gradient-to-b from-[#0c2742] via-[#091b2e] to-[#060f1b] border-cyan-400/60 shadow-cyan-950/50'
              : 'bg-gradient-to-b from-[#0e2238] via-[#0b1626] to-[#080d19] border-cyan-500/40 shadow-cyan-950/30'
            : isRolling
              ? 'bg-gradient-to-b from-[#3b0f2a] via-[#260a1b] to-[#12040d] border-pink-400/60 shadow-pink-950/50'
              : 'bg-gradient-to-b from-[#2e1022] via-[#1f0d19] to-[#0f070f] border-pink-500/40 shadow-pink-950/30'
        } ${justRevealed ? 'scale-[1.02] ring-4 ring-amber-400/40' : ''}`}
      >
        {/* Card Header Icon & Status */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isTruth ? (
              <FileQuestion className="w-5 h-5 text-cyan-400" />
            ) : (
              <Flame className="w-5 h-5 text-pink-400" />
            )}
            <span
              className={`text-xs font-black tracking-widest uppercase ${
                isTruth ? 'text-cyan-400' : 'text-pink-400'
              }`}
            >
              {isTruth ? 'Truth Question' : 'Dare Challenge'}
            </span>
          </div>

          {isRolling ? (
            <span className="text-xs font-black text-amber-400 tracking-wider flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CYCLING...</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-400">
              Pool: {totalPromptsCount}
            </span>
          )}
        </div>

        {/* Central Prompt Text Reel */}
        <div className="my-auto py-6 sm:py-8 text-center relative overflow-hidden">
          <p
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight text-balance transition-all ${
              isRolling 
                ? 'opacity-85 blur-[0.4px] translate-y-[-1px]' 
                : 'opacity-100 blur-none scale-100'
            }`}
          >
            &ldquo;{displayedPrompt.text}&rdquo;
          </p>

          {isRolling && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
          )}
        </div>

        {/* Single Item Notice if change requested with 1 item */}
        {showSingleItemNotice && (
          <div className="mb-2 p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 flex items-center gap-2 animate-in fade-in">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              This is the only {isTruth ? 'Truth' : 'Dare'} in your current list. Add more in Manage Questions to enable swaps.
            </span>
          </div>
        )}

        {/* Card Footer Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {!isRolling ? (
            <>
              <button
                onClick={handleChangeClick}
                disabled={!hasAlternativePrompt}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasAlternativePrompt
                    ? isTruth
                      ? 'text-cyan-300 hover:text-white hover:bg-cyan-500/20 active:scale-95'
                      : 'text-pink-300 hover:text-white hover:bg-pink-500/20 active:scale-95'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Change {isTruth ? 'Question' : 'Dare'}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                {hasAlternativePrompt ? 'Free reshuffle' : 'Only 1 available'}
              </span>
            </>
          ) : (
            <div className="w-full text-center text-xs text-slate-400 animate-pulse">
              Tap STOP below to lock in your challenge!
            </div>
          )}
        </div>
      </div>

      {/* Action Controls: STOP button while rolling, Next Turn when stopped */}
      <div className="mt-5 w-full">
        {isRolling ? (
          /* Exciting STOP Button */
          <button
            onClick={handleStopRoll}
            className="w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-black text-white bg-gradient-to-r from-red-500 via-rose-600 to-amber-500 hover:from-red-400 hover:to-amber-400 active:scale-95 shadow-2xl shadow-rose-950/60 border border-rose-300/40 flex items-center justify-center gap-3 transition-all cursor-pointer animate-pulse"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>STOP & REVEAL!</span>
          </button>
        ) : (
          /* Normal Next Turn Controls */
          <div className="space-y-3">
            {keepScore ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onNextTurn(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all cursor-pointer border border-slate-700/60"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  <span>Pass / Skip</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onNextTurn(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done! Next Turn</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playButtonTap();
                  onNextTurn(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                <span>Next Turn (Spin Wheel)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
