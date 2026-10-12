import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, Challenge, PairPlayer, WordTopic } from '../types';
import { WordIcon } from './WordIcon';
import { sounds } from '../utils/audio';

interface QuestionModalProps {
  pair: PairPlayer;
  question?: Question;
  challenge?: Challenge;
  isRandomReplacement?: boolean;
  teacherPassword: string;
  onAnswerSubmitted: (data: {
    type: 'question' | 'challenge';
    text: string;
    topic: WordTopic;
    isCorrect: boolean;
    explanation: string;
    studentAnswerText?: string;
  }) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  pair,
  question,
  challenge,
  isRandomReplacement = false,
  teacherPassword,
  onAnswerSubmitted,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCorrectGraded, setIsCorrectGraded] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);

  // Teacher secret answer key lock state
  const [isTeacherKeyUnlocked, setIsTeacherKeyUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delay showing "Lanjut" button slightly after evaluation for dramatic effect
  useEffect(() => {
    if (isAnswerRevealed) {
      const timer = setTimeout(() => {
        setShowNextButton(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAnswerRevealed]);

  // 1. Direct Evaluation for Multiple Choice Word Questions
  const handleOptionClick = (index: number) => {
    if (isAnswerRevealed || !question) return;

    setSelectedOption(index);
    const correct = index === question.correctIndex;
    setIsCorrectGraded(correct);
    setIsAnswerRevealed(true);

    if (correct) {
      sounds.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sounds.playEncouragement();
    }
  };

  // 2. Evaluation for Oral Challenge
  const handleGradeChallenge = (correct: boolean) => {
    if (isAnswerRevealed) return;
    setIsCorrectGraded(correct);
    setIsAnswerRevealed(true);

    if (correct) {
      sounds.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sounds.playEncouragement();
    }
  };

  // Teacher password unlock handler
  const handleUnlockTeacherKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === teacherPassword.trim()) {
      setIsTeacherKeyUnlocked(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Sandi salah, coba lagi.');
    }
  };

  // Lock back teacher key
  const handleLockBack = () => {
    setIsTeacherKeyUnlocked(false);
    setPasswordError('');
    setPasswordInput('');
  };

  // Move to next step / next pair
  const handleFinishAndNext = () => {
    if (question) {
      const isCorrect = isCorrectGraded ?? (selectedOption === question.correctIndex);
      onAnswerSubmitted({
        type: 'question',
        text: question.question,
        topic: question.topic,
        isCorrect: isCorrect,
        explanation: question.explanation,
        studentAnswerText: selectedOption !== null ? question.options[selectedOption] : undefined,
      });
    } else if (challenge) {
      const isCorrect = isCorrectGraded ?? true;
      onAnswerSubmitted({
        type: 'challenge',
        text: challenge.instruction,
        topic: challenge.topic,
        isCorrect: isCorrect,
        explanation: challenge.keyPoints.join(' • '),
        studentAnswerText: isCorrect ? 'Berhasil dijawab lisan' : 'Perlu diingat kembali',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-blue-600 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between border-b-4 border-amber-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
                Giliran Menjawab:
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {pair.student1} &amp; {pair.student2}
            </h2>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full text-white">
              {question ? `Topik: ${question.topic}` : `Tantangan: ${challenge?.topic}`}
            </span>
            {isRandomReplacement && (
              <span className="text-[10px] text-amber-200 mt-0.5">
                (Soal Acak Kotak Ceria)
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* =========================================================================
              A. SOAL PILIHAN GANDA (Direct Click Evaluation)
          ========================================================================= */}
          {question && (
            <>
              {/* Question Banner & Icon */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
                <div className="flex-shrink-0">
                  <WordIcon name={question.iconName} size={48} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                    Pertanyaan Kelas (Pilihan Ganda)
                  </span>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug mt-1">
                    "{question.question}"
                  </p>
                </div>
              </div>

              {/* 4 Multiple Choice Options (Direct Evaluation on Click) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {question.options.map((option, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = selectedOption === idx;
                  const isCorrectKey = idx === question.correctIndex;

                  let optionStyle =
                    'bg-slate-50 border-slate-300 text-slate-800 hover:bg-blue-50 hover:border-blue-400 active:scale-98';
                  let statusBadge = null;

                  if (isAnswerRevealed) {
                    if (isSelected && isCorrectKey) {
                      // Jawaban siswa BENAR
                      optionStyle =
                        'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold ring-4 ring-emerald-500 scale-102 shadow-lg';
                      statusBadge = (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1">
                          ✓ Benar!
                        </span>
                      );
                    } else if (isSelected && !isCorrectKey) {
                      // Jawaban siswa SALAH (Belum tepat)
                      optionStyle =
                        'bg-rose-100 border-rose-600 text-rose-950 font-bold ring-4 ring-rose-500 shadow-md';
                      statusBadge = (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-extrabold flex items-center gap-1">
                          ✕ Belum tepat!
                        </span>
                      );
                    } else if (!isSelected && isCorrectKey) {
                      // Kunci jawaban yang benar
                      optionStyle =
                        'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400';
                      statusBadge = (
                        <span className="ml-auto text-emerald-700 text-xs font-bold">
                          (Kunci Benar)
                        </span>
                      );
                    } else {
                      // Pilihan lainnya
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswerRevealed}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-3 text-left transition-all duration-200 cursor-pointer ${optionStyle} ${
                        isAnswerRevealed ? 'cursor-default' : ''
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl font-extrabold flex items-center justify-center flex-shrink-0 text-base shadow-sm ${
                          isAnswerRevealed && isCorrectKey
                            ? 'bg-emerald-600 text-white'
                            : isAnswerRevealed && isSelected && !isCorrectKey
                            ? 'bg-rose-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {letters[idx]}
                      </span>
                      <span className="text-base sm:text-lg font-semibold leading-tight">
                        {option}
                      </span>
                      {statusBadge}
                    </button>
                  );
                })}
              </div>

              {/* Instructions before clicking */}
              {!isAnswerRevealed && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 font-medium flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    Diskusikan jawaban bersama pasangan. Operator/guru cukup mengeklik salah satu pilihan di atas untuk langsung melihat hasilnya!
                  </span>
                </div>
              )}

              {/* Instant Result and Explanation */}
              {isAnswerRevealed && (
                <div
                  className={`p-5 rounded-2xl border-3 space-y-3 animate-fadeIn shadow-md ${
                    isCorrectGraded
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-rose-50 border-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {isCorrectGraded ? '🎉' : '💡'}
                    </span>
                    <div>
                      <h3
                        className={`text-lg sm:text-xl font-black ${
                          isCorrectGraded ? 'text-emerald-900' : 'text-rose-900'
                        }`}
                      >
                        {isCorrectGraded
                          ? 'Benar! Jawaban Tepat Sekali!'
                          : 'Belum tepat! Jangan berkecil hati, mari kita pelajari:'}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        Kunci Jawaban:{' '}
                        <strong className="text-emerald-900 font-bold">
                          {['A', 'B', 'C', 'D'][question.correctIndex]}.{' '}
                          {question.options[question.correctIndex]}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-800 font-medium">
                    📘 <strong>Penjelasan:</strong> {question.explanation}
                  </div>
                </div>
              )}
            </>
          )}

          {/* =========================================================================
              B. SOAL TANTANGAN (Oral Discussion with Password-Locked Answer Key)
          ========================================================================= */}
          {challenge && (
            <>
              {/* Challenge Banner */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-purple-50 border-2 border-purple-300">
                <div className="flex-shrink-0">
                  <WordIcon name={challenge.iconName} size={52} />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                    Tantangan Diskusi Lisan
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                    {challenge.title}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 leading-relaxed">
                    "{challenge.instruction}"
                  </p>
                </div>
              </div>

              {/* FITUR 1: KUNCI JAWABAN KHUSUS GURU (Terkunci dengan Sandi) */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {isTeacherKeyUnlocked ? '🔓' : '🔒'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Poin Kunci Jawaban (Panduan Guru)
                    </h4>
                  </div>

                  {isTeacherKeyUnlocked && (
                    <button
                      type="button"
                      onClick={handleLockBack}
                      className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    >
                      🔒 Kunci Kembali
                    </button>
                  )}
                </div>

                {/* State: Locked -> Input Sandi Guru */}
                {!isTeacherKeyUnlocked ? (
                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-600">
                      Kunci jawaban sengaja dikunci agar tidak terbaca oleh siswa di proyektor. Masukkan sandi guru untuk membukanya.
                    </p>

                    <form
                      onSubmit={handleUnlockTeacherKey}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        placeholder="Masukkan sandi guru..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow cursor-pointer transition-colors"
                      >
                        Buka Kunci
                      </button>
                    </form>

                    {passwordError && (
                      <p className="text-xs font-bold text-rose-600 animate-fadeIn">
                        ⚠️ {passwordError}
                      </p>
                    )}
                  </div>
                ) : (
                  /* State: Unlocked -> Tampilkan Poin Kunci */
                  <div className="space-y-2 animate-fadeIn bg-white p-3.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] font-extrabold text-blue-700 uppercase block">
                      Panduan Jawaban Terbuka:
                    </span>
                    <ul className="space-y-1.5">
                      {challenge.keyPoints.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-sm font-semibold text-slate-800 flex items-start gap-2"
                        >
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* FITUR 3: PENILAIAN TANTANGAN OLEH OPERATOR/GURU */}
              {!isAnswerRevealed && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-amber-950">
                    Siswa menjawab tantangan secara lisan. Setelah siswa selesai menjawab, operator mengeklik penilaian di bawah:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleGradeChallenge(true)}
                      className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>👍</span>
                      <span>Benar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGradeChallenge(false)}
                      className="py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>✕</span>
                      <span>Belum Tepat</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tampilan Hasil Evaluasi Tantangan */}
              {isAnswerRevealed && (
                <div
                  className={`p-5 rounded-2xl border-3 space-y-3 animate-fadeIn shadow-md ${
                    isCorrectGraded
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-rose-50 border-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {isCorrectGraded ? '🎉' : '💡'}
                    </span>
                    <div>
                      <h3
                        className={`text-lg sm:text-xl font-black ${
                          isCorrectGraded ? 'text-emerald-900' : 'text-rose-900'
                        }`}
                      >
                        {isCorrectGraded
                          ? 'Benar! Tantangan Berhasil Dijawab!'
                          : 'Belum Tepat! Tetap Semangat!'}
                      </h3>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">
                        {isCorrectGraded
                          ? 'Kerja sama yang baik antara kedua siswa dalam menjawab.'
                          : 'Topik ini dicatat untuk dipelajari kembali pada sesi refleksi.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-800 font-medium">
                    📘 <strong>Inti Jawaban:</strong> {challenge.keyPoints.join('. ')}.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer / Tombol Lanjut ke Giliran Berikutnya */}
        {isAnswerRevealed && showNextButton && (
          <div className="p-4 sm:p-5 bg-slate-100 border-t-2 border-slate-200 flex justify-end animate-fadeIn">
            <button
              type="button"
              onClick={handleFinishAndNext}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-lg sm:text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Lanjut</span>
              <span className="text-2xl">➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
