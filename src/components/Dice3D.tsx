import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';

interface Dice3DProps {
  isRolling: boolean;
  value: number;
  onRollComplete?: () => void;
  showOverlay?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  isRolling,
  value,
  onRollComplete,
  showOverlay = false,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value || 1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isRolling) {
      setIsFinished(false);
      // Rapid tumbling numbers and sounds
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        sounds.playDiceShake();
      }, 90);

      // Stop after 1.6s
      timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplayValue(value);
        setIsFinished(true);
        sounds.playDiceResult();

        // Brief pause so students see the result on projector before moving
        setTimeout(() => {
          if (onRollComplete) {
            onRollComplete();
          }
        }, 1500);
      }, 1600);
    } else {
      setDisplayValue(value || 1);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRolling, value]);

  // Render dice face with dots (pips)
  const renderPips = (num: number) => {
    // 3x3 grid positions: top-left, top-mid, top-right, mid-left, center, mid-right, bot-left, bot-mid, bot-right
    const pipsConfig: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeIndices = new Set(pipsConfig[num] || [4]);

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-3 gap-1.5 pointer-events-none">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activeIndices.has(idx) && (
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 shadow-inner block" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const content = (
    <div className="flex flex-col items-center justify-center select-none">
      {/* 3D Dice Cube */}
      <div
        className={`relative w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-3xl border-4 border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.25)] flex items-center justify-center transition-transform duration-100 ${
          isRolling
            ? 'animate-spin scale-110 rotate-12 bg-amber-50'
            : isFinished
            ? 'scale-105 ring-8 ring-amber-400 ring-offset-4 ring-offset-slate-900/40'
            : 'hover:scale-105'
        }`}
      >
        {renderPips(displayValue)}
      </div>

      {/* Big result announcement */}
      {isFinished && !isRolling && (
        <div className="mt-6 text-center animate-bounce">
          <div className="inline-block px-8 py-3 rounded-2xl bg-amber-400 border-4 border-slate-900 text-slate-900 font-extrabold text-2xl sm:text-3xl shadow-xl">
            🎉 Kalian mendapatkan angka {displayValue}!
          </div>
          <p className="text-white text-base sm:text-lg mt-2 font-medium drop-shadow-md">
            Pion siap melangkah di papan...
          </p>
        </div>
      )}

      {isRolling && (
        <div className="mt-6 text-center">
          <span className="inline-block px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xl sm:text-2xl shadow-lg animate-pulse">
            🎲 Mengocok dadu...
          </span>
        </div>
      )}
    </div>
  );

  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="flex flex-col items-center max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
