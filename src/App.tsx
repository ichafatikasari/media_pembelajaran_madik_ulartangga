import React, { useState, useEffect, useRef } from 'react';
import {
  BoardSquare,
  Question,
  Challenge,
  PairPlayer,
  TurnRecord,
  WordTopic,
} from './types';
import { BOARD_SQUARES, WORD_QUESTIONS, WORD_CHALLENGES } from './data/questions';
import { WordIcon } from './components/WordIcon';
import { Board } from './components/Board';
import { Dice3D } from './components/Dice3D';
import { QuestionModal } from './components/QuestionModal';
import { NextPairModal } from './components/NextPairModal';
import { ReflectionModal } from './components/ReflectionModal';
import { SettingsModal } from './components/SettingsModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { sounds } from './utils/audio';

type GameScreen = 'start' | 'playing' | 'reflection';

export default function App() {
  // Screens: 'start', 'playing', 'reflection'
  const [screen, setScreen] = useState<GameScreen>('start');

  // Initial Form for Pair 1
  const [initialStudent1, setInitialStudent1] = useState('');
  const [initialStudent2, setInitialStudent2] = useState('');
  const [initialFormError, setInitialFormError] = useState('');

  // Active Pair
  const [currentPair, setCurrentPair] = useState<PairPlayer>({
    student1: '',
    student2: '',
  });
  const [pairCounter, setPairCounter] = useState<number>(1);

  // Pawn & Board State (Continuous, never resets on pair change)
  const [pawnPosition, setPawnPosition] = useState<number>(1);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [movementPathInfo, setMovementPathInfo] = useState<string>('');

  // Dice State
  const [diceRolling, setDiceRolling] = useState<boolean>(false);
  const [showDiceOverlay, setShowDiceOverlay] = useState<boolean>(false);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState<boolean>(false);

  // Question & Challenge Modals
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isRandomReplacement, setIsRandomReplacement] = useState<boolean>(false);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);

  // Next Pair Modal
  const [showNextPairModal, setShowNextPairModal] = useState<boolean>(false);

  // Bank Soal Modal
  const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false);

  // Settings & Teacher Password Modal
  const [teacherPassword, setTeacherPassword] = useState<string>('guru123');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Turn records for classroom reflection
  const [historyRecords, setHistoryRecords] = useState<TurnRecord[]>([]);

  // Question shuffling pool to prevent repeats
  const [remainingQuestionIds, setRemainingQuestionIds] = useState<string[]>([]);
  const [remainingChallengeIds, setRemainingChallengeIds] = useState<string[]>([]);

  // Sound toggle
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Current turn tracking
  const currentTurnData = useRef<{
    roll: number;
    fromSquare: number;
    intermediateSquare: number;
    finalSquare: number;
    specialEvent?: 'ladder' | 'snake' | 'none';
  }>({
    roll: 1,
    fromSquare: 1,
    intermediateSquare: 1,
    finalSquare: 1,
  });

  // Initialize question pools
  useEffect(() => {
    shufflePools();
  }, []);

  const shufflePools = () => {
    const qIds = [...WORD_QUESTIONS.map((q) => q.id)].sort(
      () => Math.random() - 0.5
    );
    const cIds = [...WORD_CHALLENGES.map((c) => c.id)].sort(
      () => Math.random() - 0.5
    );
    setRemainingQuestionIds(qIds);
    setRemainingChallengeIds(cIds);
  };

  // Toggle audio
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.enabled = !nextMute;
  };

  // Start game with Pair 1
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialStudent1.trim() || !initialStudent2.trim()) {
      setInitialFormError('Harap isi Nama Siswa 1 dan Nama Siswa 2 terlebih dahulu!');
      return;
    }
    setInitialFormError('');
    setCurrentPair({
      student1: initialStudent1.trim(),
      student2: initialStudent2.trim(),
    });
    setPairCounter(1);
    setPawnPosition(1);
    setHasRolledThisTurn(false);
    setScreen('playing');
  };

  // Pick an unused question or recycle pool
  const getNextQuestion = (): Question => {
    let pool = [...remainingQuestionIds];
    if (pool.length === 0) {
      pool = [...WORD_QUESTIONS.map((q) => q.id)].sort(
        () => Math.random() - 0.5
      );
    }
    const nextId = pool.pop()!;
    setRemainingQuestionIds(pool);
    return (
      WORD_QUESTIONS.find((q) => q.id === nextId) || WORD_QUESTIONS[0]
    );
  };

  // Pick an unused challenge or recycle pool
  const getNextChallenge = (): Challenge => {
    let pool = [...remainingChallengeIds];
    if (pool.length === 0) {
      pool = [...WORD_CHALLENGES.map((c) => c.id)].sort(
        () => Math.random() - 0.5
      );
    }
    const nextId = pool.pop()!;
    setRemainingChallengeIds(pool);
    return (
      WORD_CHALLENGES.find((c) => c.id === nextId) || WORD_CHALLENGES[0]
    );
  };

  // Menghitung urutan langkah pion termasuk pantulan mundur jika dadu melebihi kotak 36
  const calculatePathSequence = (startSq: number, diceRoll: number): number[] => {
    const path: number[] = [];
    let current = startSq;
    let direction = 1; // 1: maju, -1: mundur

    for (let i = 0; i < diceRoll; i++) {
      if (direction === 1) {
        if (current < 36) {
          current += 1;
        } else {
          // Melebihi kotak 36 (FINISH), berbalik arah / mantul mundur
          direction = -1;
          current -= 1;
        }
      } else {
        current -= 1;
      }
      path.push(current);
    }
    return path;
  };

  // Teacher/Operator clicks "LEMPAR DADU"
  const handleRollDice = () => {
    if (hasRolledThisTurn || isMoving || diceRolling) return;

    const rolledNumber = Math.floor(Math.random() * 6) + 1;
    setDiceValue(rolledNumber);
    setDiceRolling(true);
    setShowDiceOverlay(true);
    setHasRolledThisTurn(true);

    const path = calculatePathSequence(pawnPosition, rolledNumber);
    const finalDest = path[path.length - 1];

    currentTurnData.current = {
      roll: rolledNumber,
      fromSquare: pawnPosition,
      intermediateSquare: finalDest,
      finalSquare: finalDest,
      specialEvent: 'none',
    };
  };

  // Called when dice animation completes
  const handleDiceComplete = () => {
    setDiceRolling(false);
    setShowDiceOverlay(false);

    // Start Step-by-Step pawn movement (dengan pantulan mundur jika lewat 36)
    startStepByStepMovement(
      currentTurnData.current.fromSquare,
      currentTurnData.current.roll
    );
  };

  // Step-by-Step Pawn Movement (450ms per step dengan visual pantulan mundur)
  const startStepByStepMovement = (startSq: number, steps: number) => {
    setIsMoving(true);
    const path = calculatePathSequence(startSq, steps);
    const hasBounce = startSq + steps > 36;
    const finalIntermediate = path[path.length - 1];

    if (hasBounce) {
      setMovementPathInfo(`Maju sampai kotak 36, lalu mantul mundur ke kotak ${finalIntermediate}...`);
    } else {
      setMovementPathInfo(`Melangkah dari kotak ${startSq} ke kotak ${finalIntermediate}...`);
    }

    let stepIndex = 0;
    const peakIndex = path.indexOf(36);

    const moveInterval = setInterval(() => {
      if (stepIndex < path.length) {
        const nextPos = path[stepIndex];
        setPawnPosition(nextPos);
        sounds.playStepHop();

        if (hasBounce) {
          if (nextPos === 36) {
            setMovementPathInfo(`Sampai kotak 36 (FINISH)! Sisa langkah mantul mundur...`);
          } else if (peakIndex !== -1 && stepIndex > peakIndex) {
            const stepsRemaining = path.length - 1 - stepIndex;
            setMovementPathInfo(`Mantul mundur ke kotak ${nextPos} (sisa ${stepsRemaining} langkah)...`);
          }
        }

        stepIndex++;
      } else {
        clearInterval(moveInterval);

        // Selesai melangkah, periksa kotak kedatangan (apakah tangga, ular, atau kotak biasa/finish)
        setTimeout(() => {
          handleArrivalAtSquare(finalIntermediate);
        }, 400);
      }
    }, 450);
  };

  // Handle Ladder climb, Snake slide, or Arrival at square
  const handleArrivalAtSquare = (squareNumber: number) => {
    const squareConfig = BOARD_SQUARES.find((s) => s.number === squareNumber);

    // Jika sampai tepat di kotak 36 (FINISH)
    if (squareNumber === 36) {
      setMovementPathInfo('🏆 Hore! Berhasil sampai tepat di kotak 36 (FINISH)!');
      sounds.playCorrect();
      currentTurnData.current.finalSquare = 36;

      setTimeout(() => {
        setIsMoving(false);
        setMovementPathInfo('');
        triggerQuestionOrChallenge(36);
      }, 700);
      return;
    }

    if (squareConfig?.type === 'ladder' && squareConfig.target) {
      // Climb Ladder!
      setMovementPathInfo(`🪜 Hore! Menemukan tangga naik ke kotak ${squareConfig.target}!`);
      sounds.playLadderClimb();

      setTimeout(() => {
        setPawnPosition(squareConfig.target!);
        currentTurnData.current.finalSquare = squareConfig.target!;
        currentTurnData.current.specialEvent = 'ladder';

        setTimeout(() => {
          setIsMoving(false);
          setMovementPathInfo('');
          triggerQuestionOrChallenge(squareConfig.target!);
        }, 700);
      }, 700);
    } else if (squareConfig?.type === 'snake' && squareConfig.target) {
      // Slide Down Snake!
      setMovementPathInfo(`🐍 Ups! Terpeleset ular turun ke kotak ${squareConfig.target}!`);
      sounds.playSnakeSlide();

      setTimeout(() => {
        setPawnPosition(squareConfig.target!);
        currentTurnData.current.finalSquare = squareConfig.target!;
        currentTurnData.current.specialEvent = 'snake';

        setTimeout(() => {
          setIsMoving(false);
          setMovementPathInfo('');
          triggerQuestionOrChallenge(squareConfig.target!);
        }, 700);
      }, 700);
    } else {
      // Normal arrival
      setIsMoving(false);
      setMovementPathInfo('');
      triggerQuestionOrChallenge(squareNumber);
    }
  };

  // Trigger Question, Challenge, or Random Replacement Question
  const triggerQuestionOrChallenge = (finalSquare: number) => {
    const sq = BOARD_SQUARES.find((s) => s.number === finalSquare);

    if (sq?.type === 'challenge') {
      const ch = getNextChallenge();
      setActiveChallenge(ch);
      setActiveQuestion(null);
      setIsRandomReplacement(false);
      setShowQuestionModal(true);
    } else if (sq?.type === 'question') {
      const q = getNextQuestion();
      setActiveQuestion(q);
      setActiveChallenge(null);
      setIsRandomReplacement(false);
      setShowQuestionModal(true);
    } else {
      // As specified: If square is normal/bonus/ladder-end/etc.,
      // system gives a random replacement question so EVERY pair answers 1 question/challenge!
      const q = getNextQuestion();
      setActiveQuestion(q);
      setActiveChallenge(null);
      setIsRandomReplacement(true);
      setShowQuestionModal(true);
    }
  };

  // When teacher / system submits answer in QuestionModal
  const handleAnswerSubmitted = (data: {
    type: 'question' | 'challenge';
    text: string;
    topic: WordTopic;
    isCorrect: boolean;
    explanation: string;
    studentAnswerText?: string;
  }) => {
    // Record this turn in reflection history
    const record: TurnRecord = {
      pair: currentPair,
      diceRoll: currentTurnData.current.roll,
      fromSquare: currentTurnData.current.fromSquare,
      intermediateSquare: currentTurnData.current.intermediateSquare,
      finalSquare: currentTurnData.current.finalSquare,
      specialEvent: currentTurnData.current.specialEvent,
      questionOrChallenge: data,
      timestamp: new Date(),
    };

    setHistoryRecords((prev) => [...prev, record]);

    // Close Question Modal
    setShowQuestionModal(false);
    setActiveQuestion(null);
    setActiveChallenge(null);

    // Buka Kotak "Giliran Berikutnya"
    setShowNextPairModal(true);
  };

  // Transition to Next Pair:
  // Kalo pion sudah di angka 36, pemain selanjutnya mulai dari awal lagi (Kotak 1)
  const handleNextPairSubmit = (newPair: PairPlayer) => {
    setCurrentPair(newPair);
    setPairCounter((prev) => prev + 1);
    setHasRolledThisTurn(false);
    setShowNextPairModal(false);

    if (pawnPosition >= 36) {
      setPawnPosition(1);
    }
  };

  // Mulai Sesi Baru: semua pemain yang sudah main otomatis direset bersih
  const handleResetSession = () => {
    setPawnPosition(1);
    setPairCounter(1);
    setHasRolledThisTurn(false);
    setIsMoving(false);
    setHistoryRecords([]); // Semua riwayat pemain yang sudah main otomatis direset
    shufflePools();
    setInitialStudent1('');
    setInitialStudent2('');
    setShowNextPairModal(false);
    setShowQuestionModal(false);
    setShowQuestionBankModal(false);
    setShowSettingsModal(false);
    setScreen('start'); // Otomatis kembali ke halaman awal
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-['Poppins',sans-serif]">
      {/* =========================================================================
          TOP NAVIGATION BAR (Projector Header)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WordIcon name="word-app" size={40} className="shadow-sm rounded-lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-blue-700 uppercase tracking-wider">
                Informatika Kelas 10
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
                Ice Breaking 10–15 Menit
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
              ULAR TANGGA WORD ADVENTURE
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bank Soal Button */}
          <button
            type="button"
            onClick={() => setShowQuestionBankModal(true)}
            className="px-3 py-2.5 rounded-xl border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Akses & Lihat Seluruh Bank Soal beserta Kunci dan Penjelasan"
          >
            <span>📚</span>
            <span className="hidden sm:inline">Bank Soal</span>
          </button>

          {/* Settings / Sandi Guru */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Pengaturan Sandi Guru"
          >
            <span>⚙️</span>
            <span className="hidden lg:inline">Sandi Guru</span>
          </button>

          {/* Mute/Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
            title={isMuted ? 'Suara Dinonaktifkan' : 'Suara Aktif'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden md:inline">{isMuted ? 'Mute' : 'Audio On'}</span>
          </button>

          {/* Selesai Bermain / Refleksi Button (Always accessible) */}
          <button
            type="button"
            onClick={() => setScreen('reflection')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>📋</span>
            <span>Refleksi ({historyRecords.length})</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          SCREEN 1: HALAMAN AWAL (Section C)
      ========================================================================= */}
      {screen === 'start' && (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-blue-600 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden">
            {/* Background Decorative Ribbon */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-300 rounded-full blur-2xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-300 rounded-full blur-2xl opacity-50 pointer-events-none" />

            {/* Illustration Row: Board, Dice, Pawn, Word Icon */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md transform -rotate-6">
                🪜
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 border-3 border-slate-900 flex items-center justify-center text-3xl sm:text-4xl shadow-lg transform scale-105">
                <WordIcon name="word-app" size={44} />
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 border-2 border-red-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md transform rotate-6">
                🎲
              </div>
            </div>

            {/* 1. Judul Game */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              ULAR TANGGA WORD ADVENTURE
            </h1>

            {/* 2. Subjudul Singkat */}
            <p className="text-lg sm:text-xl font-bold text-blue-700 mt-2">
              “Ayo bermain sambil mengingat fitur Microsoft Word!”
            </p>

            {/* Form Permulaan Pasangan 1 */}
            <form onSubmit={handleStartGame} className="mt-8 text-left space-y-4 max-w-lg mx-auto">
              {initialFormError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-semibold text-center">
                  ⚠️ {initialFormError}
                </div>
              )}

              {/* 3. Kolom "Nama Siswa 1" */}
              <div>
                <label className="block text-sm sm:text-base font-extrabold text-slate-800 mb-1">
                  Nama Siswa 1 (Siswa Pertama)
                </label>
                <input
                  type="text"
                  value={initialStudent1}
                  onChange={(e) => setInitialStudent1(e.target.value)}
                  placeholder="Masukkan nama siswa pertama..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-900 font-semibold text-base"
                />
              </div>

              {/* 4. Kolom "Nama Siswa 2" */}
              <div>
                <label className="block text-sm sm:text-base font-extrabold text-slate-800 mb-1">
                  Nama Siswa 2 (Pasangan Sebangku)
                </label>
                <input
                  type="text"
                  value={initialStudent2}
                  onChange={(e) => setInitialStudent2(e.target.value)}
                  placeholder="Masukkan nama siswa kedua..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-900 font-semibold text-base"
                />
              </div>

              {/* 5. Tombol "MULAI BERMAIN" */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black text-xl shadow-xl shadow-orange-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer mt-4"
              >
                <span>MULAI BERMAIN</span>
                <span className="text-2xl">➔</span>
              </button>
            </form>

            {/* 6. Petunjuk Singkat Cara Bermain */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-left max-w-lg mx-auto">
              <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider flex items-center gap-2 mb-2">
                <span>📖</span> Petunjuk Singkat Cara Bermain:
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-5 font-medium">
                <li>Satu pasangan mendapat <strong>1 kali lemparan dadu</strong> dan <strong>1 soal atau tantangan</strong>.</li>
                <li>Permainan menggunakan <strong>satu papan bersama</strong> dan <strong>satu pion</strong> yang terus berjalan.</li>
                <li>Posisi pion <strong>tidak direset</strong> saat pasangan berganti. Pasangan berikutnya melanjutkan dari kotak terakhir.</li>
                <li>Soal pilihan ganda langsung memverifikasi jawaban benar atau salah saat pilihan diklik!</li>
              </ul>
            </div>

            {/* Tombol Akses Bank Soal di Layar Awal */}
            <div className="mt-4 text-center max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setShowQuestionBankModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-900 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📚</span>
                <span>Buka &amp; Pelajari Seluruh Bank Soal (32 Soal &amp; 12 Tantangan)</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================================
          SCREEN 2: MAIN BOARD PLAYING SCREEN
      ========================================================================= */}
      {screen === 'playing' && (
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* LEFT / CENTER: Papan Ular Tangga 36 Kotak */}
          <section className="w-full lg:w-7/12 flex flex-col items-center">
            {movementPathInfo && (
              <div className="w-full max-w-[680px] mb-2.5 p-2.5 rounded-xl bg-amber-400 border-2 border-slate-900 text-slate-950 font-black text-sm text-center shadow-md animate-pulse">
                {movementPathInfo}
              </div>
            )}

            <Board
              squares={BOARD_SQUARES}
              currentSquare={pawnPosition}
              isMoving={isMoving}
              pairNames={`${currentPair.student1} & ${currentPair.student2}`}
            />
          </section>

          {/* RIGHT / SIDE PANEL: Active Turn Control & Projector Stage */}
          <section className="w-full lg:w-5/12 space-y-4">
            {/* Active Pair Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-3 border-blue-600 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
                  Pasangan ke-{pairCounter}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Posisi Pion: <strong>Kotak {pawnPosition}</strong>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Giliran Bermain Sekarang:
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                  {currentPair.student1} &amp; {currentPair.student2}
                </h2>
              </div>

              {/* Status Message */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium flex items-start gap-2.5">
                <span className="text-xl">🎲</span>
                <span>
                  {hasRolledThisTurn
                    ? 'Giliran pasangan ini telah selesai. Klik "Pasangan Berikutnya" untuk melanjutkan dari kotak pion saat ini.'
                    : 'Silakan klik tombol di bawah untuk mengocok dadu digital!'}
                </span>
              </div>

              {/* Central Dice Action Area */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-dashed border-slate-300">
                <Dice3D
                  isRolling={false}
                  value={diceValue}
                  showOverlay={false}
                />

                <div className="mt-5 w-full">
                  {!hasRolledThisTurn ? (
                    <button
                      type="button"
                      onClick={handleRollDice}
                      disabled={isMoving || diceRolling}
                      className="w-full py-4 sm:py-5 rounded-2xl font-black text-xl sm:text-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer bg-orange-600 hover:bg-orange-700 active:scale-95 text-white shadow-orange-600/30"
                    >
                      <span>LEMPAR DADU</span>
                      <span className="text-3xl">🎲</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowNextPairModal(true)}
                      className="w-full py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/30 animate-pulse"
                    >
                      <span>Pasangan Berikutnya</span>
                      <span className="text-2xl">➔</span>
                    </button>
                  )}
                  {hasRolledThisTurn && (
                    <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                      Pion tetap di Kotak {pawnPosition}. Pasangan berikutnya melanjutkan dari kotak ini!
                    </p>
                  )}
                </div>
              </div>

              {/* Quick switch button if teacher wants to open Next Pair box */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowNextPairModal(true)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                >
                  Buka Kotak Giliran Berikutnya ➔
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  Kotak 36 = FINISH
                </span>
              </div>
            </div>

            {/* Notification Banner when Next Pair is ready */}
            {hasRolledThisTurn && !showNextPairModal && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase">
                    Siap Untuk Giliran Selanjutnya?
                  </h4>
                  <p className="text-xs text-amber-800">
                    Posisi pion aman di <strong>Kotak {pawnPosition}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNextPairModal(true)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow cursor-pointer whitespace-nowrap"
                >
                  Pasangan Berikutnya
                </button>
              </div>
            )}

            {/* Classroom Session Summary Pill */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  Riwayat Soal Terjawab:
                </span>
                <span className="text-base font-black text-slate-900">
                  {historyRecords.length} Jawaban Tersimpan
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScreen('reflection')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Lihat Refleksi ➔
              </button>
            </div>
          </section>
        </main>
      )}

      {/* =========================================================================
          SCREEN 3: REFLEKSI AKHIR PEMBELAJARAN (Section M)
      ========================================================================= */}
      {screen === 'reflection' && (
        <ReflectionModal
          records={historyRecords}
          onBackToGame={() => setScreen('playing')}
          onResetSession={handleResetSession}
        />
      )}

      {/* =========================================================================
          MODAL OVERLAYS (Dice Roll, Question/Challenge, Next Pair, Settings)
      ========================================================================= */}

      {/* Big Digital Dice Overlay during roll */}
      {showDiceOverlay && (
        <Dice3D
          isRolling={diceRolling}
          value={diceValue}
          showOverlay={true}
          onRollComplete={handleDiceComplete}
        />
      )}

      {/* Question or Challenge Modal in Center of Screen */}
      {showQuestionModal && (activeQuestion || activeChallenge) && (
        <QuestionModal
          pair={currentPair}
          question={activeQuestion || undefined}
          challenge={activeChallenge || undefined}
          isRandomReplacement={isRandomReplacement}
          teacherPassword={teacherPassword}
          onAnswerSubmitted={handleAnswerSubmitted}
        />
      )}

      {/* FITUR 4: Kotak Giliran Berikutnya (dengan tombol X di pojok kanan atas) */}
      {showNextPairModal && (
        <NextPairModal
          currentSquare={pawnPosition}
          pairIndex={pairCounter + 1}
          onSubmit={handleNextPairSubmit}
          onClose={() => setShowNextPairModal(false)}
        />
      )}

      {/* Settings Modal (Sandi Guru & Mulai Sesi Baru) */}
      {showSettingsModal && (
        <SettingsModal
          currentPassword={teacherPassword}
          onSavePassword={(newPass) => setTeacherPassword(newPass)}
          onClose={() => setShowSettingsModal(false)}
          onResetSession={handleResetSession}
        />
      )}

      {/* Bank Soal Modal (32 Soal & 12 Tantangan beserta Kunci & Penjelasan) */}
      {showQuestionBankModal && (
        <QuestionBankModal onClose={() => setShowQuestionBankModal(false)} />
      )}
    </div>
  );
}
