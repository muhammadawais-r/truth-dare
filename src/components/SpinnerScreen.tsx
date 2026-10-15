import React, { useState, useRef, useEffect, useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { Player } from '../types/game';
import { sounds } from '../utils/audio';

interface SpinnerScreenProps {
  players: Player[];
  onPlayerSelected: (playerIndex: number) => void;
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export const SpinnerScreen: React.FC<SpinnerScreenProps> = ({
  players,
  onPlayerSelected,
  reducedMotion,
  soundEnabled,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState<number | null>(null);
  const [showResultCard, setShowResultCard] = useState(false);

  const filterId = useId();
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

  const animationFrameRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef<number>(0);

  const N = players.length;
  const sliceAngle = 360 / N;

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    sounds.playButtonTap();

    setIsSpinning(true);
    setShowResultCard(false);
    setSelectedWinnerIndex(null);

    // 1. Uniformly select winning player index [0 .. N-1]
    const winnerIndex = Math.floor(Math.random() * N);

    // 2. Calculate target rotation so slice winnerIndex lands at 12 o'clock (0 degrees)
    // Slice i spans [i * sliceAngle, (i + 1) * sliceAngle] clockwise from 12 o'clock.
    // Center of slice: (winnerIndex + 0.5) * sliceAngle.
    const sliceCenter = (winnerIndex + 0.5) * sliceAngle;

    // Subtle organic micro-offset within +-20% of slice half-width
    const maxOffset = sliceAngle * 0.2;
    const microOffset = (Math.random() - 0.5) * maxOffset;

    // Full rotations: fast 5-6 full spins (or 2 if reduced motion)
    const fullSpins = reducedMotion ? 2 : 5;
    const currentRot = rotationRef.current;
    const currentNormalized = ((currentRot % 360) + 360) % 360;

    // Angle needed to align (sliceCenter + microOffset) with 12 o'clock (360)
    let neededDelta = (360 - sliceCenter + microOffset) - currentNormalized;
    while (neededDelta < 0) {
      neededDelta += 360;
    }

    const totalSpinDelta = (fullSpins * 360) + neededDelta;

    const startTime = performance.now();
    const duration = reducedMotion ? 1200 : 3600; // ms

    lastTickAngleRef.current = currentRot;

    // Smooth quintic ease out for deceleration
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4.5);

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      const currentAngle = currentRot + totalSpinDelta * easedProgress;
      setRotation(currentAngle);

      // Audio tick when crossing sector boundaries
      const angleDiff = Math.abs(currentAngle - lastTickAngleRef.current);
      if (angleDiff >= sliceAngle) {
        if (soundEnabled) {
          sounds.playSpinTick(600 + (1 - progress) * 200);
        }
        lastTickAngleRef.current = currentAngle;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        setSelectedWinnerIndex(winnerIndex);
        setShowResultCard(true);
        if (soundEnabled) {
          sounds.playWinChime();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  const handleProceedToChoice = () => {
    if (selectedWinnerIndex === null) return;
    sounds.playButtonTap();
    onPlayerSelected(selectedWinnerIndex);
  };

  // Helper to create SVG sector path with exact center (200, 200)
  const createSectorPath = (index: number) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
    const radius = 175;
    const cx = 200;
    const cy = 200;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const winningPlayer = selectedWinnerIndex !== null ? players[selectedWinnerIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center py-2 sm:py-6 px-4 max-w-xl mx-auto w-full select-none">
      {/* Turn instruction */}
      <div className="text-center mb-3 h-14 flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Spin The Wheel
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          {isSpinning 
            ? 'Selecting player...' 
            : showResultCard && winningPlayer 
              ? `It's ${winningPlayer.name}'s turn!` 
              : 'Tap SPIN to fairly select who plays next.'}
        </p>
      </div>

      {/* Wheel Stage Container - Fixed Size & Stable Origin */}
      <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center shrink-0 my-1">
        {/* Glowing outer bezel ring (Fixed) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-pink-500/15 blur-xl pointer-events-none" />

        {/* Outer Metal Bezel Rim (Fixed, never rotates) */}
        <div className="absolute inset-2 rounded-full border-4 border-slate-700/80 bg-slate-950/80 shadow-2xl pointer-events-none" />

        {/* Top Pointer Indicator Arrow (Fixed at 12 o'clock) */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pointer-events-none">
          <div
            className="w-6 h-8 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-t-sm border border-amber-200 shadow-md"
            style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
          />
        </div>

        {/* SVG Wheel Stage */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full block filter drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={`drop-shadow-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.7"/>
            </filter>
            {/* Luminous lighting overlay */}
            <radialGradient id="wheel-shine" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* Rotating Group around EXACT center (200, 200) */}
          <g
            transform={`rotate(${rotation}, 200, 200)`}
            style={{ willChange: 'transform' }}
          >
            {/* Wheel Sectors */}
            {players.map((player, idx) => {
              const midAngle = (idx + 0.5) * sliceAngle;
              const textRadius = N > 7 ? 120 : 115;
              const isFlipped = midAngle > 90 && midAngle < 270;
              // Use vivid color directly from PLAYER_COLORS for maximum brightness
              const brightColor = player.color || '#22D3EE';

              return (
                <g key={player.id || idx}>
                  {/* Wedge Slice with high luminosity */}
                  <path
                    d={createSectorPath(idx)}
                    fill={brightColor}
                    stroke="#0b0f19"
                    strokeWidth="2.5"
                    style={{ filter: 'brightness(1.12) saturate(1.2)' }}
                  />

                  {/* Player Name Text along slice */}
                  <g
                    transform={`
                      rotate(${midAngle}, 200, 200) 
                      translate(200, ${200 - textRadius}) 
                      rotate(${isFlipped ? 180 : 0})
                    `}
                  >
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#070a13"
                      fontWeight="900"
                      fontSize={N > 8 ? "11.5" : N > 6 ? "12.5" : "14.5"}
                      filter={`url(#drop-shadow-${filterId})`}
                      className="font-sans"
                      style={{ letterSpacing: '0.01em' }}
                    >
                      {player.name.length > 10 ? player.name.slice(0, 9) + '…' : player.name}
                    </text>
                    <text
                      x="0"
                      y={isFlipped ? "-13" : "13"}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#070a13"
                      fontWeight="800"
                      fontSize="9.5"
                      opacity="0.9"
                      className="font-mono"
                    >
                      #{idx + 1}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Subtle gloss overlay rotating with the wheel */}
            <circle
              cx="200"
              cy="200"
              r="175"
              fill="url(#wheel-shine)"
              className="pointer-events-none"
            />
          </g>

          {/* Fixed Inner Hub Rim Ring */}
          <circle
            cx="200"
            cy="200"
            r="48"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="4"
            className="pointer-events-none"
          />
        </svg>

        {/* Fixed Center SPIN Button Hub */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            aria-label="Spin the wheel"
            className={`pointer-events-auto w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center font-extrabold tracking-wider transition-all cursor-pointer ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 scale-95 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-br from-amber-400 via-pink-500 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/40'
            }`}
          >
            <span className="text-xs sm:text-sm font-black drop-shadow">
              {isSpinning ? 'SPINNING' : 'SPIN'}
            </span>
          </button>
        </div>
      </div>

      {/* Stable Action / Result Area - Reserved Height to prevent page layout jump */}
      <div className="w-full max-w-sm min-h-[140px] flex items-center justify-center mt-3">
        {showResultCard && winningPlayer ? (
          <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: winningPlayer.color }}
              />
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Selected Player
              </span>
            </div>

            <div className="text-2xl font-black text-white">
              {winningPlayer.name}
            </div>

            <button
              onClick={handleProceedToChoice}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
            >
              <span>Choose Truth or Dare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-500 px-4 py-3">
            {isSpinning ? 'Wheel is in motion...' : 'Press the center button to spin!'}
          </div>
        )}
      </div>

      {/* Participating Players Badges */}
      <div className="mt-2 flex flex-wrap justify-center gap-1.5 max-w-lg">
        {players.map((p, idx) => (
          <div
            key={p.id || idx}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedWinnerIndex === idx
                ? 'bg-slate-800 border-white text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

