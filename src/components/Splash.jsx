import React from 'react';
// Kita pakai ikon loader dari lucide-react yang sudah terinstal di project lu
import { Loader2 } from 'lucide-react';

const Splash = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-600 text-white z-50">
      {/* Bagian Logo / Judul Skripsi */}
      <div className="text-center mb-6 animate-pulse">
        <h1 className="text-4xl font-extrabold tracking-wider">SPK SKRIPSI</h1>
        <p className="text-sm font-medium opacity-80 mt-2 uppercase tracking-widest">
          Sistem Pendukung Keputusan
        </p>
      </div>

      {/* Spinner Loading */}
      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Memuat Sistem...</span>
      </div>
    </div>
  );
};

export default Splash;