import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileQuestion, Flame, ArrowRight, 
  CheckCircle2, XCircle, RotateCcw, HelpCircle, ShieldAlert
} from 'lucide-react';
import { Player, WildcardPrompt } from '../types/game';
import { sounds } from '../utils/audio';

interface WildcardScreenProps {
  player: Player;
  cards: WildcardPrompt[];
  revealedCount: number;
  totalLibraryCount: number;
  isDeckExhausted: boolean;
  onCardRevealed: (prompt: WildcardPrompt) => void;
  onNextTurn: (completed: boolean) => void;
  onResetDeckHistory: () => void;
  keepScore: boolean;
}

export const WildcardScreen: React.FC<WildcardScreenProps> = ({
  player,
  cards,
  revealedCount,
  totalLibraryCount,
  isDeckExhausted,
  onCardRevealed,
  onNextTurn,
  onResetDeckHistory,
  keepScore,
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  // Reset local selection when cards change
  useEffect(() => {
    setSelectedCardIndex(null);
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (selectedCardIndex !== null) return; // Prevent multiple flips
    sounds.playCardFlip();
    setSelectedCardIndex(index);
    const chosenPrompt = cards[index];
    if (chosenPrompt) {
      onCardRevealed(chosenPrompt);
    }
  };

  const activeCard = selectedCardIndex !== null ? cards[selectedCardIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8 px-3 sm:px-4 max-w-3xl mx-auto w-full select-none">
      {/* Player Header */}
      <div className="text-center space-y-2 mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-md">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <span className="font-semibold text-white">{player.name}&rsquo;s Turn</span>
          <span className="text-slate-500">· Wildcard Mystery</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {selectedCardIndex === null ? 'Pick a Face-Down Card' : 'Your Mystery Revealed!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          {selectedCardIndex === null 
            ? '6 hidden cards are dealt. Tap any card to flip it and reveal your fate.'
            : 'Perform your revealed challenge or answer your mystery truth!'}
        </p>
      </div>

      {/* Deck Exhaustion Banner if all 60 have been revealed */}
      {isDeckExhausted && (
        <div className="mb-4 w-full max-w-lg p-3 rounded-2xl bg-amber-950/60 border border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>All {totalLibraryCount} unique Wildcards have been revealed in this session.</span>
          </div>
          <button
            onClick={() => {
              sounds.playButtonTap();
              onResetDeckHistory();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Deck</span>
          </button>
        </div>
      )}

      {/* 3-by-2 Grid of Cards (3 cols x 2 rows on mobile and desktop) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-lg sm:max-w-xl mx-auto my-2">
        {cards.map((card, idx) => {
          const isSelected = selectedCardIndex === idx;
          const isOtherFlipped = selectedCardIndex !== null && !isSelected;

          const isTruth = card.category === 'truth';
          const isDare = card.category === 'dare';

          return (
            <div
              key={card.id + '_' + idx}
              onClick={() => handleCardClick(idx)}
              className={`relative aspect-[3/4] rounded-2xl cursor-pointer transition-all duration-300 perspective-1000 ${
                isOtherFlipped ? 'opacity-40 scale-95 pointer-events-none' : 'hover:scale-[1.03] active:scale-95'
              }`}
              style={{ perspective: '1000px' }}
            >
              {/* Flippable Card Container */}
              <div
                className={`w-full h-full relative rounded-2xl transition-transform duration-500 shadow-xl`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* CARD BACK (Face Down) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#1a0b2e] via-[#110724] to-[#070314] border-2 border-purple-500/50 flex flex-col items-center justify-center p-2.5 text-center shadow-lg shadow-purple-950/40 select-none overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Decorative tarot-style geometric border inside */}
                  <div className="absolute inset-1.5 rounded-xl border border-dashed border-purple-400/30 pointer-events-none" />

                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-1.5 shadow-inner">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
                  </div>

                  <span className="text-[10px] sm:text-xs font-black tracking-widest text-purple-300/90 uppercase">
                    Card #{idx + 1}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                    Tap to Flip
                  </span>
                </div>

                {/* CARD FRONT (Revealed Face Up) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl border-2 flex flex-col justify-between p-3 sm:p-4 text-center shadow-2xl overflow-hidden ${
                    isTruth
                      ? 'bg-gradient-to-b from-[#0c2742] via-[#091b2e] to-[#060f1b] border-cyan-400 shadow-cyan-950/60'
                      : isDare
                        ? 'bg-gradient-to-b from-[#3b0f2a] via-[#260a1b] to-[#12040d] border-pink-400 shadow-pink-950/60'
                        : 'bg-gradient-to-b from-[#2e174d] via-[#1c0c33] to-[#0f051c] border-amber-400 shadow-amber-950/60'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-center gap-1">
                    {isTruth ? (
                      <FileQuestion className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : isDare ? (
                      <Flame className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    )}
                    <span
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        isTruth
                          ? 'text-cyan-400'
                          : isDare
                            ? 'text-pink-400'
                            : 'text-amber-300'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  {/* Card Title & Mini Excerpt */}
                  <div className="my-auto">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight mb-1">
                      {card.title}
                    </h4>
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono">
                    Revealed
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revealed Full Prompt Banner */}
      {activeCard && (
        <div className="mt-4 w-full max-w-lg p-5 rounded-3xl bg-slate-900 border-2 border-purple-500/50 shadow-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-bold text-amber-300">
            {activeCard.category === 'truth' ? (
              <FileQuestion className="w-3.5 h-3.5 text-cyan-400" />
            ) : activeCard.category === 'dare' ? (
              <Flame className="w-3.5 h-3.5 text-pink-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{activeCard.badge} · {activeCard.title}</span>
          </div>

          <p className="text-base sm:text-lg font-extrabold text-white leading-snug px-2 text-balance">
            &ldquo;{activeCard.text}&rdquo;
          </p>

          {/* Action Buttons for Turn Completion */}
          <div className="pt-2">
            {keepScore ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onNextTurn(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all cursor-pointer border border-slate-700/60"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  <span>Pass / Skip</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onNextTurn(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
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
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 active:scale-[0.98] shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
              >
                <span>Done! Next Turn (Spin Wheel)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress & Deck Stats */}
      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400 font-mono">
        <span>Revealed: {revealedCount} / {totalLibraryCount}</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>{Math.max(0, totalLibraryCount - revealedCount)} Unseen Cards</span>
      </div>
    </div>
  );
};
