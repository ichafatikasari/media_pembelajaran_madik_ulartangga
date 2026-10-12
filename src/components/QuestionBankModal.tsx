import React, { useState, useMemo } from 'react';
import { WORD_QUESTIONS, WORD_CHALLENGES } from '../data/questions';
import { WordIcon } from './WordIcon';
import { WordTopic } from '../types';

interface QuestionBankModalProps {
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'challenges'>('questions');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allTopics: string[] = [
    'Semua',
    'Bold',
    'Italic',
    'Underline',
    'Bullets',
    'Numbering',
    'Align Left',
    'Center',
    'Align Right',
    'Justify',
    'Font',
    'Font Size',
    'Page Border Art',
    'Insert Picture',
    'Insert Symbol',
  ];

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return WORD_QUESTIONS.filter((q) => {
      const matchTopic = selectedTopic === 'Semua' || q.topic === selectedTopic;
      const matchSearch =
        searchQuery.trim() === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTopic && matchSearch;
    });
  }, [selectedTopic, searchQuery]);

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return WORD_CHALLENGES.filter((c) => {
      const matchTopic = selectedTopic === 'Semua' || c.topic === selectedTopic;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keyPoints.some((pt) => pt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTopic && matchSearch;
    });
  }, [selectedTopic, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-blue-600 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 px-6 py-5 text-white flex items-center justify-between border-b-4 border-amber-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                Pusat Sumber Belajar
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Bank Soal Microsoft Word
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
              Daftar lengkap pertanyaan kuis &amp; tantangan beserta kunci jawaban dan penjelasannya
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-2xl cursor-pointer transition-colors"
            title="Tutup Bank Soal"
          >
            ✕
          </button>
        </div>

        {/* Toolbar: Tabs, Search, and Category Filters */}
        <div className="p-4 sm:p-5 bg-slate-100 border-b border-slate-200 space-y-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'questions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>📝</span>
                <span>Soal Pilihan Ganda ({WORD_QUESTIONS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('challenges')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'challenges'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>🎯</span>
                <span>Soal Tantangan ({WORD_CHALLENGES.length})</span>
              </button>
            </div>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>

          {/* Search bar & Topic pill filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan, topik, atau kata kunci..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 text-xs sm:text-sm font-medium"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Topic dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Topik:
              </span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: SOAL PILIHAN GANDA */}
          {activeTab === 'questions' && (
            <>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="font-bold">Tidak ada soal yang sesuai dengan pencarian.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTopic('Semua');
                    }}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-blue-300 transition-all shadow-sm space-y-3"
                      >
                        {/* Header: Number, Topic, Icon */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[11px] uppercase tracking-wide">
                                {q.topic}
                              </span>
                            </div>
                          </div>

                          <WordIcon name={q.iconName} size={36} />
                        </div>

                        {/* Question Text */}
                        <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          "{q.question}"
                        </p>

                        {/* 4 Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === q.correctIndex;
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold ${
                                  isCorrect
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-md font-extrabold text-xs flex items-center justify-center flex-shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {letters[optIdx]}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isCorrect && (
                                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">
                                    ✓ KUNCI
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium flex items-start gap-2">
                          <span className="text-base flex-shrink-0">📘</span>
                          <div>
                            <strong>Penjelasan:</strong> {q.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* TAB 2: SOAL TANTANGAN LISAN */}
          {activeTab === 'challenges' && (
            <>
              {filteredChallenges.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="font-bold">Tidak ada tantangan yang sesuai dengan pencarian.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTopic('Semua');
                    }}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChallenges.map((c, idx) => (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/50 hover:border-purple-400 transition-all shadow-sm space-y-3"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[11px] uppercase tracking-wide">
                              {c.topic}
                            </span>
                            <h3 className="font-extrabold text-base text-purple-950 mt-0.5">
                              {c.title}
                            </h3>
                          </div>
                        </div>

                        <WordIcon name={c.iconName} size={36} />
                      </div>

                      {/* Instruction */}
                      <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed bg-white p-3.5 rounded-xl border border-purple-200">
                        "{c.instruction}"
                      </p>

                      {/* Key Points Answer Guide */}
                      <div className="p-3.5 rounded-xl bg-white border border-purple-200">
                        <span className="text-[11px] font-black uppercase text-purple-900 tracking-wider block mb-1.5">
                          Poin Panduan Jawaban (Kunci Guru):
                        </span>
                        <ul className="space-y-1">
                          {c.keyPoints.map((pt, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs sm:text-sm font-semibold text-slate-800 flex items-start gap-2"
                            >
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            Total {WORD_QUESTIONS.length} Soal Pilihan Ganda &amp; {WORD_CHALLENGES.length} Tantangan Diskusi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
