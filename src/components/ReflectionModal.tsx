import React, { useState } from 'react';
import { TurnRecord, WordTopic } from '../types';
import { WordIcon } from './WordIcon';

interface ReflectionModalProps {
  records: TurnRecord[];
  onBackToGame: () => void;
  onResetSession: () => void;
}

// Explanations for reflection
const TOPIC_SUMMARY_TIPS: Record<WordTopic, string> = {
  Bold: 'Bold (ikon B) digunakan untuk menebalkan teks agar lebih tegas dan menonjol.',
  Italic: 'Italic (ikon I) digunakan untuk memiringkan tulisan kata asing atau istilah khusus.',
  Underline: 'Underline (ikon U bergaris bawah) memberi garis di bawah kata penting.',
  Bullets: 'Bullets digunakan untuk membuat daftar poin bertanda bulatan atau simbol (tanpa nomor).',
  Numbering: 'Numbering digunakan untuk membuat daftar bertingkat dengan angka urut 1, 2, 3.',
  'Page Border Art': 'Page Border Art menghias keliling lembar dokumen dengan motif bingkai bergambar.',
  'Insert Picture': 'Insert Picture digunakan untuk memasukkan foto atau gambar ke dalam dokumen Word.',
  'Insert Symbol': 'Insert Symbol menyisipkan karakter unik yang tidak ada di keyboard seperti derajat atau centang.',
  'Align Left': 'Align Left meratakan tepi teks rapi di sisi sebelah kiri (default dokumen).',
  Center: 'Center memposisikan baris teks tepat di tengah halaman (cocok untuk judul).',
  'Align Right': 'Align Right merapikan tulisan di sisi sebelah kanan (cocok untuk titimangsa tanggal).',
  Justify: 'Justify meratakan teks di sisi kiri sekaligus kanan seperti paragraf buku cetak.',
  Font: 'Font digunakan untuk memilih jenis atau model bentuk huruf (seperti Calibri, Arial).',
  'Font Size': 'Font Size mengatur seberapa besar atau kecil ukuran teks yang kita inginkan.',
};

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  records,
  onBackToGame,
  onResetSession,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Group records by pair identifier
  const pairMap = new Map<
    string,
    {
      pairName: string;
      student1: string;
      student2: string;
      records: TurnRecord[];
    }
  >();

  records.forEach((rec) => {
    const key = `${rec.pair.student1} & ${rec.pair.student2}`.toLowerCase();
    if (!pairMap.has(key)) {
      pairMap.set(key, {
        pairName: `${rec.pair.student1} & ${rec.pair.student2}`,
        student1: rec.pair.student1,
        student2: rec.pair.student2,
        records: [],
      });
    }
    pairMap.get(key)!.records.push(rec);
  });

  const pairList = Array.from(pairMap.values());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-blue-600 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 px-6 py-5 text-white flex items-center justify-between border-b-4 border-amber-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                Refleksi Pembelajaran
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Refleksi Pembelajaran Microsoft Word
            </h2>
            <p className="text-sm text-blue-200 mt-1">
              Catatan pemahaman bersama untuk materi Informatika Kelas 10 MA/SMA
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl text-white">
              Total {pairList.length} Pasangan Bermain
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {pairList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <span className="text-5xl block mb-3">🎲</span>
              <p className="text-lg font-bold">Belum ada pasangan yang menyelesaikan soal.</p>
              <p className="text-sm">Mulailah bermain untuk melihat catatan refleksi di sini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pairList.map((pairItem, pIdx) => {
                const understoodTopics = new Set<WordTopic>();
                const reviewTopics = new Set<WordTopic>();

                pairItem.records.forEach((rec) => {
                  if (rec.questionOrChallenge.isCorrect) {
                    understoodTopics.add(rec.questionOrChallenge.topic);
                  } else {
                    reviewTopics.add(rec.questionOrChallenge.topic);
                  }
                });

                // If a topic was answered both correctly and wrongly, review wins
                Array.from(reviewTopics).forEach((topic) => {
                  understoodTopics.delete(topic);
                });

                const understoodArray = Array.from(understoodTopics);
                const reviewArray = Array.from(reviewTopics);
                const isAllPerfect = reviewArray.length === 0 && understoodArray.length > 0;

                return (
                  <div
                    key={pIdx}
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                          {pIdx + 1}
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            {pairItem.pairName}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {pairItem.records.length} aktivitas diselesaikan
                          </span>
                        </div>
                      </div>

                      {isAllPerfect && (
                        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 border border-emerald-300">
                          <span>🎉</span> Pemahaman Sangat Baik!
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5 space-y-3">
                      {/* Sudah Dipahami */}
                      {understoodArray.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-emerald-600 text-base">✅</span>
                            <span className="text-sm font-bold text-emerald-950">
                              Sudah Dipahami:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {understoodArray.map((topic, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Perlu Diingat Kembali */}
                      {reviewArray.length > 0 ? (
                        <div className="pt-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-amber-600 text-base">💡</span>
                            <span className="text-sm font-bold text-amber-950">
                              Perlu Diingat Kembali:
                            </span>
                          </div>
                          <div className="space-y-2 pl-6">
                            {reviewArray.map((topic, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-medium"
                              >
                                <strong className="text-amber-900 font-bold block mb-0.5">
                                  {topic}:
                                </strong>
                                <span>{TOPIC_SUMMARY_TIPS[topic]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        understoodArray.length > 0 && (
                          <p className="text-xs sm:text-sm text-slate-600 pl-6 italic">
                            Semua pertanyaan dijawab dengan tepat. Pertahankan semangat belajar!
                          </p>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* In-UI Reset Confirmation Banner */}
        {showResetConfirm && (
          <div className="p-4 bg-rose-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-extrabold text-sm sm:text-base leading-tight">
                  Yakin ingin mulai sesi baru?
                </p>
                <p className="text-xs text-rose-100">
                  Seluruh {records.length} jawaban tersimpan dari pemain lama akan dihapus permanen dan pion kembali ke Kotak 1.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetSession();
                }}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
              >
                Ya, Reset Semua Jawaban Sekarang! 🔄
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToGame}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow transition-all cursor-pointer flex items-center gap-2"
            >
              <span>⬅</span>
              <span>Kembali ke Permainan</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Cetak Ringkasan</span>
            </button>
          </div>

          {!showResetConfirm && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Mulai Sesi Baru (Reset Semua)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
