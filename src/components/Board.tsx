import React from 'react';
import { BoardSquare } from '../types';
import { WordIcon } from './WordIcon';

interface BoardProps {
  squares: BoardSquare[];
  currentSquare: number;
  isMoving: boolean;
  pairNames: string;
}

// Utility to get 0-indexed column (0-5) and row from top (0-5)
export const getSquareCoords = (num: number) => {
  const clamped = Math.max(1, Math.min(36, num));
  const rowFromBottom = Math.floor((clamped - 1) / 6);
  const indexInRow = (clamped - 1) % 6;
  const col = rowFromBottom % 2 === 0 ? indexInRow : 5 - indexInRow;
  const rowFromTop = 5 - rowFromBottom;
  return { col, rowFromTop, rowFromBottom };
};

export const Board: React.FC<BoardProps> = ({
  squares,
  currentSquare,
  isMoving,
  pairNames,
}) => {
  const pawnCoords = getSquareCoords(currentSquare);

  // Ladders & snakes coordinates for SVG drawing
  // Percentages: center of column (col + 0.5) / 6 * 100, center of row (row + 0.5) / 6 * 100
  const getCenterPercent = (squareNum: number) => {
    const { col, rowFromTop } = getSquareCoords(squareNum);
    return {
      x: ((col + 0.5) / 6) * 100,
      y: ((rowFromTop + 0.5) / 6) * 100,
    };
  };

  const ladders = [
    { from: 3, to: 15 },
    { from: 8, to: 21 },
    { from: 16, to: 27 },
    { from: 22, to: 33 },
  ];

  const snakes = [
    { from: 17, to: 6, color: '#EF4444' },
    { from: 23, to: 10, color: '#F97316' },
    { from: 29, to: 14, color: '#DC2626' },
    { from: 35, to: 19, color: '#B91C1C' },
  ];

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      {/* Board Outer Frame */}
      <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-blue-900 to-indigo-950 shadow-2xl border-4 border-amber-400">
        {/* Header ribbon on top of board */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2.5 rounded-xl bg-blue-950/80 border border-blue-400/30 text-xs sm:text-sm font-semibold text-amber-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Papan Bersama (36 Kotak)
          </span>
          <span className="text-white truncate max-w-[220px]">
            Giliran: <strong className="text-amber-300">{pairNames || 'Siswa'}</strong>
          </span>
        </div>

        {/* 6x6 Grid Container */}
        <div className="relative aspect-square w-full rounded-2xl bg-slate-900 overflow-hidden shadow-inner border-2 border-blue-300/40">
          {/* Square Tiles */}
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full p-1 sm:p-1.5 gap-1 sm:gap-1.5">
            {/* Generate in visual order (rowFromTop 0 to 5, col 0 to 5) */}
            {Array.from({ length: 6 }).map((_, rTop) => {
              const rBottom = 5 - rTop;
              return Array.from({ length: 6 }).map((_, col) => {
                const indexInRow = rBottom % 2 === 0 ? col : 5 - col;
                const squareNum = rBottom * 6 + indexInRow + 1;
                const sq = squares.find((s) => s.number === squareNum) || {
                  number: squareNum,
                  type: 'normal',
                  color: '#3B82F6',
                };
                const isPawnHere = currentSquare === squareNum;

                // Color styles based on square type
                let bgStyle = 'bg-white';
                let borderStyle = 'border-slate-200';
                let badgeText = '';

                if (sq.type === 'start') {
                  bgStyle = 'bg-emerald-100 text-emerald-950 font-bold';
                  borderStyle = 'border-emerald-500 border-2';
                  badgeText = 'MULAI';
                } else if (sq.type === 'finish') {
                  bgStyle = 'bg-amber-200 text-amber-950 font-extrabold';
                  borderStyle = 'border-amber-500 border-2 animate-pulse';
                  badgeText = 'FINISH';
                } else if (sq.type === 'ladder') {
                  bgStyle = 'bg-amber-50 text-amber-900';
                  borderStyle = 'border-amber-400 border-2';
                  badgeText = `▲ ${sq.target}`;
                } else if (sq.type === 'snake') {
                  bgStyle = 'bg-rose-50 text-rose-900';
                  borderStyle = 'border-rose-400 border-2';
                  badgeText = `▼ ${sq.target}`;
                } else if (sq.type === 'challenge') {
                  bgStyle = 'bg-purple-50 text-purple-900';
                  borderStyle = 'border-purple-300';
                  badgeText = 'Tantangan';
                } else if (sq.type === 'bonus') {
                  bgStyle = 'bg-yellow-50 text-yellow-900';
                  borderStyle = 'border-yellow-300';
                  badgeText = 'Bintang';
                } else if (sq.type === 'question') {
                  bgStyle = 'bg-blue-50 text-blue-900';
                  borderStyle = 'border-blue-200';
                  badgeText = 'Soal';
                } else {
                  bgStyle = 'bg-slate-50 text-slate-800';
                  borderStyle = 'border-slate-200';
                }

                return (
                  <div
                    key={squareNum}
                    className={`relative rounded-xl ${bgStyle} ${borderStyle} border flex flex-col justify-between p-1 sm:p-1.5 shadow-sm transition-all duration-200 overflow-hidden ${
                      isPawnHere ? 'ring-4 ring-amber-400 ring-offset-1 z-20' : ''
                    }`}
                  >
                    {/* Top row: Number and Mini Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs sm:text-base leading-none text-slate-900">
                        {squareNum}
                      </span>
                      {badgeText && (
                        <span
                          className={`text-[8px] sm:text-[10px] font-bold px-1 py-0.5 rounded leading-none ${
                            sq.type === 'ladder'
                              ? 'bg-amber-300 text-amber-950'
                              : sq.type === 'snake'
                              ? 'bg-rose-500 text-white'
                              : sq.type === 'start'
                              ? 'bg-emerald-600 text-white'
                              : sq.type === 'finish'
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : sq.type === 'challenge'
                              ? 'bg-purple-200 text-purple-900'
                              : sq.type === 'bonus'
                              ? 'bg-yellow-300 text-yellow-900'
                              : 'bg-blue-200 text-blue-900'
                          }`}
                        >
                          {badgeText}
                        </span>
                      )}
                    </div>

                    {/* Center Icon according to square type */}
                    <div className="flex items-center justify-center my-auto">
                      {sq.type === 'start' && (
                        <span className="text-base sm:text-2xl">🚩</span>
                      )}
                      {sq.type === 'finish' && (
                        <span className="text-base sm:text-2xl">🏆</span>
                      )}
                      {sq.type === 'ladder' && (
                        <span className="text-base sm:text-2xl text-amber-600 font-bold" title="Tangga Naik">
                          🪜
                        </span>
                      )}
                      {sq.type === 'snake' && (
                        <span className="text-base sm:text-2xl text-rose-600" title="Ular Turun">
                          🐍
                        </span>
                      )}
                      {sq.type === 'challenge' && (
                        <span className="text-sm sm:text-xl">🎯</span>
                      )}
                      {sq.type === 'bonus' && (
                        <span className="text-sm sm:text-xl">⭐</span>
                      )}
                      {sq.type === 'question' && (
                        <span className="text-xs sm:text-base font-bold text-blue-700 bg-blue-100/80 px-1 py-0.5 rounded">
                          Word 📝
                        </span>
                      )}
                      {sq.type === 'normal' && (
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                          ✦
                        </span>
                      )}
                    </div>

                    {/* Subtle footer indicator for target */}
                    {sq.target && (
                      <div className="text-[8px] sm:text-[9px] text-center font-semibold text-slate-600 truncate">
                        {sq.type === 'ladder' ? `ke ${sq.target}` : `turun ${sq.target}`}
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>

          {/* SVG Overlay: Graphic Ladders and Snakes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>

            {/* Render Ladders */}
            {ladders.map(({ from, to }, idx) => {
              const start = getCenterPercent(from);
              const end = getCenterPercent(to);
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const len = Math.hypot(dx, dy);
              const rungs = Math.max(3, Math.floor(len / 7));

              // Parallel rails offset
              const perpX = (-dy / len) * 2;
              const perpY = (dx / len) * 2;

              return (
                <g key={`ladder-${idx}`} opacity="0.85">
                  {/* Left Rail */}
                  <line
                    x1={start.x - perpX}
                    y1={start.y - perpY}
                    x2={end.x - perpX}
                    y2={end.y - perpY}
                    stroke="#D97706"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Right Rail */}
                  <line
                    x1={start.x + perpX}
                    y1={start.y + perpY}
                    x2={end.x + perpX}
                    y2={end.y + perpY}
                    stroke="#D97706"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Rungs */}
                  {Array.from({ length: rungs }).map((_, rIdx) => {
                    const t = (rIdx + 1) / (rungs + 1);
                    const rx = start.x + dx * t;
                    const ry = start.y + dy * t;
                    return (
                      <line
                        key={`rung-${rIdx}`}
                        x1={rx - perpX}
                        y1={ry - perpY}
                        x2={rx + perpX}
                        y2={ry + perpY}
                        stroke="#F59E0B"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Render Snakes */}
            {snakes.map(({ from, to }, idx) => {
              const start = getCenterPercent(from); // Head (higher square)
              const end = getCenterPercent(to);     // Tail (lower square)
              const midX = (start.x + end.x) / 2 + (idx % 2 === 0 ? 6 : -6);
              const midY = (start.y + end.y) / 2;

              return (
                <g key={`snake-${idx}`} opacity="0.85">
                  {/* Snake body shadow */}
                  <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    fill="none"
                    stroke="#450A0A"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                  {/* Snake body */}
                  <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeDasharray="1.5 1.5"
                    strokeLinecap="round"
                  />
                  {/* Snake Head */}
                  <circle cx={start.x} cy={start.y} r="2.2" fill="#B91C1C" />
                  <circle cx={start.x - 0.6} cy={start.y - 0.6} r="0.6" fill="#FFFFFF" />
                  <circle cx={start.x - 0.6} cy={start.y - 0.6} r="0.3" fill="#000000" />
                  {/* Snake Tail */}
                  <circle cx={end.x} cy={end.y} r="1" fill="#7F1D1D" />
                </g>
              );
            })}
          </svg>

          {/* Active Pawn (Smooth transition) */}
          <div
            className={`absolute z-30 transition-all duration-400 ease-out transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
              isMoving ? 'scale-125' : 'scale-100'
            }`}
            style={{
              left: `${((pawnCoords.col + 0.5) / 6) * 100}%`,
              top: `${((pawnCoords.rowFromTop + 0.5) / 6) * 100}%`,
            }}
          >
            {/* Animated Pawn Avatar */}
            <div className="relative flex flex-col items-center">
              {/* Floating Name Pin */}
              <div className="absolute -top-6 whitespace-nowrap bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
                PION
              </div>
              {/* Pawn 3D Body */}
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-2 sm:border-3 border-slate-950 shadow-[0_6px_14px_rgba(0,0,0,0.6)] flex items-center justify-center text-slate-950 font-black text-xs sm:text-base">
                👑
              </div>
              {/* Shadow on square */}
              <div className="w-6 h-2 sm:w-8 sm:h-2.5 rounded-full bg-slate-950/50 blur-[2px] mt-0.5" />
            </div>
          </div>
        </div>

        {/* Legend under the board */}
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-blue-200">
            <span>📝</span>
            <span className="truncate">Soal Word</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-purple-200">
            <span>🎯</span>
            <span className="truncate">Tantangan</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-amber-300">
            <span>🪜</span>
            <span className="truncate">Tangga Naik</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-rose-300">
            <span>🐍</span>
            <span className="truncate">Ular Turun</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-yellow-300">
            <span>⭐</span>
            <span className="truncate">Kotak Bonus</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/60 p-1.5 rounded-lg border border-blue-400/20 text-emerald-300">
            <span>🏆</span>
            <span className="truncate">Kotak 36 Finish</span>
          </div>
        </div>
      </div>
    </div>
  );
};
