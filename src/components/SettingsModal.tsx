import React, { useState } from 'react';

interface SettingsModalProps {
  currentPassword: string;
  onSavePassword: (newPass: string) => void;
  onClose: () => void;
  onResetSession?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentPassword,
  onSavePassword,
  onClose,
  onResetSession,
}) => {
  const [passwordInput, setPasswordInput] = useState(currentPassword);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    onSavePassword(passwordInput.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handleExecuteReset = () => {
    if (onResetSession) {
      onResetSession();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-xl font-black">Pengaturan Game &amp; Sandi Guru</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Sandi Guru (Untuk Membuka Kunci Jawaban)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Sandi ini digunakan oleh guru untuk membuka kunci panduan jawaban saat siswa menjawab tantangan di depan kelas.
              </p>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan sandi baru..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-bold text-base"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Sandi bawaan saat ini: <strong className="text-blue-700">{currentPassword}</strong>
              </span>
            </div>

            {savedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold text-center animate-fadeIn">
                ✅ Sandi guru berhasil disimpan!
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow cursor-pointer"
              >
                Simpan Sandi
              </button>
            </div>
          </form>

          {/* Aturan Permainan Tambahan Info */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <p className="font-bold">Aturan Gerakan &amp; Finish:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>Jika dadu melebihi kotak 36, pion mantul mundur (misal dari 32 dapat 6, mundur ke 34).</li>
              <li>Jika pion mencapai kotak 36 (FINISH), pemain selanjutnya otomatis mulai dari Kotak 1.</li>
            </ul>
          </div>

          {/* Reset Sesi Baru */}
          {onResetSession && (
            <div className="pt-2 border-t border-slate-200">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>Mulai Sesi Baru (Reset Semua Pemain)</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-500 space-y-2 animate-fadeIn">
                  <p className="text-xs font-bold text-rose-900 text-center">
                    ⚠️ Yakin reset semua? Jawaban tersimpan dari semua pemain lama akan dihapus dan pion kembali ke Kotak 1.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="flex-1 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteReset}
                      className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow"
                    >
                      Ya, Reset Sekarang!
                    </button>
                  </div>
                </div>
              )}
              <p className="text-[11px] text-slate-500 text-center mt-1">
                Semua data pemain yang sudah main otomatis terhapus bersih.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
