import React from 'react';

interface WordIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WordIcon: React.FC<WordIconProps> = ({ name, className = '', size = 36 }) => {
  switch (name) {
    case 'word-app':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect width="48" height="48" rx="10" fill="#2B579A" />
          <path d="M12 12H36V36H12V12Z" fill="#185ABD" opacity="0.3" />
          <path
            d="M10 14L22 10V38L10 34V14Z"
            fill="#103F91"
          />
          <text
            x="16"
            y="28"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="18"
            fill="white"
            textAnchor="middle"
          >
            W
          </text>
        </svg>
      );

    case 'bold':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-blue-50 border-2 border-blue-600 font-bold text-blue-900 shadow-sm ${className}`}
          style={{ width: size, height: size, fontSize: Math.max(16, size * 0.55) }}
          title="Bold (Tebal)"
        >
          <span className="font-extrabold font-serif">B</span>
        </div>
      );

    case 'italic':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-indigo-50 border-2 border-indigo-600 italic font-serif font-bold text-indigo-900 shadow-sm ${className}`}
          style={{ width: size, height: size, fontSize: Math.max(16, size * 0.55) }}
          title="Italic (Miring)"
        >
          <span>I</span>
        </div>
      );

    case 'underline':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-amber-50 border-2 border-amber-600 font-bold text-amber-900 shadow-sm ${className}`}
          style={{ width: size, height: size, fontSize: Math.max(16, size * 0.55) }}
          title="Underline (Garis Bawah)"
        >
          <span className="underline decoration-2 underline-offset-4">U</span>
        </div>
      );

    case 'bullets':
      return (
        <div
          className={`flex flex-col justify-center items-start gap-1 p-1.5 rounded-lg bg-emerald-50 border-2 border-emerald-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Bullets"
        >
          <div className="flex items-center gap-1 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 flex-shrink-0" />
            <span className="h-1 bg-emerald-600 rounded w-4/5" />
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 flex-shrink-0" />
            <span className="h-1 bg-emerald-600 rounded w-3/5" />
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 flex-shrink-0" />
            <span className="h-1 bg-emerald-600 rounded w-4/5" />
          </div>
        </div>
      );

    case 'numbering':
      return (
        <div
          className={`flex flex-col justify-center items-start gap-0.5 p-1 rounded-lg bg-orange-50 border-2 border-orange-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Numbering"
        >
          <div className="flex items-center gap-1 w-full text-[9px] font-bold text-orange-800 leading-none">
            <span className="w-2.5">1.</span>
            <span className="h-1 bg-orange-600 rounded w-full" />
          </div>
          <div className="flex items-center gap-1 w-full text-[9px] font-bold text-orange-800 leading-none">
            <span className="w-2.5">2.</span>
            <span className="h-1 bg-orange-600 rounded w-3/4" />
          </div>
          <div className="flex items-center gap-1 w-full text-[9px] font-bold text-orange-800 leading-none">
            <span className="w-2.5">3.</span>
            <span className="h-1 bg-orange-600 rounded w-5/6" />
          </div>
        </div>
      );

    case 'align-left':
      return (
        <div
          className={`flex flex-col justify-center gap-1 p-1.5 rounded-lg bg-sky-50 border-2 border-sky-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Align Left (Rata Kiri)"
        >
          <div className="h-1 bg-sky-700 rounded w-full" />
          <div className="h-1 bg-sky-600 rounded w-2/3" />
          <div className="h-1 bg-sky-700 rounded w-5/6" />
          <div className="h-1 bg-sky-600 rounded w-1/2" />
        </div>
      );

    case 'center':
      return (
        <div
          className={`flex flex-col justify-center items-center gap-1 p-1.5 rounded-lg bg-purple-50 border-2 border-purple-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Center (Rata Tengah)"
        >
          <div className="h-1 bg-purple-700 rounded w-full" />
          <div className="h-1 bg-purple-600 rounded w-3/5" />
          <div className="h-1 bg-purple-700 rounded w-4/5" />
          <div className="h-1 bg-purple-600 rounded w-2/5" />
        </div>
      );

    case 'align-right':
      return (
        <div
          className={`flex flex-col justify-center items-end gap-1 p-1.5 rounded-lg bg-rose-50 border-2 border-rose-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Align Right (Rata Kanan)"
        >
          <div className="h-1 bg-rose-700 rounded w-full" />
          <div className="h-1 bg-rose-600 rounded w-2/3" />
          <div className="h-1 bg-rose-700 rounded w-5/6" />
          <div className="h-1 bg-rose-600 rounded w-1/2" />
        </div>
      );

    case 'justify':
      return (
        <div
          className={`flex flex-col justify-center gap-1 p-1.5 rounded-lg bg-teal-50 border-2 border-teal-600 shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Justify (Rata Kiri-Kanan)"
        >
          <div className="h-1 bg-teal-700 rounded w-full" />
          <div className="h-1 bg-teal-700 rounded w-full" />
          <div className="h-1 bg-teal-700 rounded w-full" />
          <div className="h-1 bg-teal-600 rounded w-3/4" />
        </div>
      );

    case 'font':
      return (
        <div
          className={`flex items-center justify-between px-1.5 rounded-lg bg-slate-100 border-2 border-slate-600 text-slate-800 shadow-sm ${className}`}
          style={{ width: size * 1.6, height: size }}
          title="Font (Jenis Huruf)"
        >
          <span className="font-semibold text-xs truncate">Calibri</span>
          <span className="text-[10px] text-slate-500">▼</span>
        </div>
      );

    case 'font-size':
      return (
        <div
          className={`flex items-center justify-center gap-1 px-1 rounded-lg bg-slate-100 border-2 border-slate-600 text-slate-800 font-bold shadow-sm ${className}`}
          style={{ width: size * 1.3, height: size, fontSize: Math.max(13, size * 0.45) }}
          title="Font Size (Ukuran Huruf)"
        >
          <span>12</span>
          <span className="text-[10px] text-slate-500">▼</span>
        </div>
      );

    case 'border':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-pink-50 border-2 border-dashed border-pink-600 text-pink-700 font-bold shadow-sm ${className}`}
          style={{ width: size, height: size }}
          title="Page Border Art"
        >
          <div className="w-3/4 h-3/4 border-2 border-pink-400 border-dotted flex items-center justify-center text-xs">
            🌸
          </div>
        </div>
      );

    case 'picture':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-cyan-50 border-2 border-cyan-600 text-cyan-800 shadow-sm overflow-hidden p-1 ${className}`}
          style={{ width: size, height: size }}
          title="Insert Picture"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-cyan-600">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      );

    case 'symbol':
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-violet-50 border-2 border-violet-600 text-violet-800 font-bold shadow-sm ${className}`}
          style={{ width: size, height: size, fontSize: Math.max(16, size * 0.6) }}
          title="Insert Symbol"
        >
          <span>Ω</span>
        </div>
      );

    default:
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold ${className}`}
          style={{ width: size, height: size }}
        >
          📝
        </div>
      );
  }
};
