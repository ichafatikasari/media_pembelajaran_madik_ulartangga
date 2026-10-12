import React, { useState } from 'react';
import { PairPlayer } from '../types';

interface NextPairModalProps {
  currentSquare: number;
  pairIndex: number;
  onSubmit: (pair: PairPlayer) => void;
  onClose: () => void;
}

export const NextPairModal: React.FC<NextPairModalProps> = ({
  currentSquare,
  pairIndex,
  onSubmit,
  onClose,
}) => {
  const [student1, setStudent1] = useState('');
  const [student2, setStudent2] = useState('');
  const [error, setError] = useState('');

  const hasReachedFinish = currentSquare >= 36;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student1.trim() || !student2.trim()) {
      setError('Mohon isi nama kedua siswa (Siswa 1 dan Siswa 2).');
      return;
    }
    setError('');
    onSubmit({
      student1: student1.trim(),
      student2: student2.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden">
        {/* Header with X close button */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full">
                Giliran Berikutnya
              </span>
              <span className="text-xs font-medium text-blue-200">
                Pasangan ke-{pairIndex}
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1">Siapa Pasangan Berikutnya?</h2>
            {hasReachedFinish ? (
              <p className="text-sm text-amber-300 font-bold mt-0.5 flex items-center gap-1.5">
                <span>🏆</span>
                <span>Pasangan sebelumnya FINISH! Pasangan ini mulai dari Kotak 1.</span>
              </p>
            ) : (
              <p className="text-sm text-blue-100 mt-0.5">
                Posisi pion tetap di <strong className="text-amber-300">Kotak {currentSquare}</strong> dan terus berlanjut!
              </p>
            )}
          </div>

          {/* Tombol X di pojok kanan atas untuk menutup tanpa mereset game */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-xl cursor-pointer transition-colors shadow-sm ml-2 flex-shrink-0"
            title="Tutup (Papan dan posisi pion tetap aman)"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {hasReachedFinish && (
            <div className="p-3.5 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-2.5">
              <span className="text-2xl">🎉</span>
              <div>
                <span>Pion telah mencapai Kotak 36 (FINISH)!</span>
                <p className="font-normal text-amber-900 mt-0.5">
                  Sesuai aturan permainan, giliran pemain selanjutnya akan mulai dari awal lagi di <strong>Kotak 1 (MULAI)</strong>.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Nama Siswa 1 (Sebelah Kiri)
            </label>
            <input
              type="text"
              value={student1}
              onChange={(e) => setStudent1(e.target.value)}
              placeholder="Contoh: Rian"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-semibold text-base transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Nama Siswa 2 (Sebelah Kanan)
            </label>
            <input
              type="text"
              value={student2}
              onChange={(e) => setStudent2(e.target.value)}
              placeholder="Contoh: Maya"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-semibold text-base transition-colors"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <span className="text-base">📌</span>
            <span>
              Menekan tombol silang (X) hanya menutup kotak ini tanpa menghapus data atau posisi pion.
            </span>
          </div>

          {/* Tombol Pasangan Berikutnya */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black text-lg shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Pasangan Berikutnya</span>
            <span className="text-xl">➔</span>
          </button>
        </form>
      </div>
    </div>
  );
};
