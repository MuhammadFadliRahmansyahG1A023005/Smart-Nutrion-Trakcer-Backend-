import React, { useEffect, useState } from 'react';
import fishIcon from '../assets/ikan2.png';

/* ══════════════════════════════════════════════════
   LOADING SCREEN — ditampilkan saat pergantian halaman
   ══════════════════════════════════════════════════ */
export function LoadingScreen({ message = 'Memuat data...' }) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
    const p = setInterval(() => setProgress(v => Math.min(v + Math.random()*18, 95)), 200);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <div className="font-['Poppins'] fixed inset-0 z-50 bg-pink-base flex flex-col items-center justify-center">
      {/* Bintang dekoratif */}
      <span className="absolute top-16 left-12 text-[#f2658f]/50 text-3xl select-none anim-twinkle">✦</span>
      <span className="absolute top-32 right-14 text-[#f2658f]/35 text-2xl select-none anim-twinkle-b">✦</span>
      <span className="absolute bottom-32 left-16 text-[#f2658f]/40 text-xl select-none anim-twinkle-c">✦</span>
      <span className="absolute bottom-20 right-12 text-[#f2658f]/30 text-4xl select-none anim-twinkle-d">✦</span>

      {/* Fish mascot */}
      <div className="mb-6 anim-float">
        <img src={fishIcon} alt="NutriSi" className="w-36 drop-shadow-xl"/>
      </div>

      {/* Brand */}
      <div className="flex items-center gap-2 mb-2 anim-scale-in anim-d1">
        <div className="bg-[#f2658f] rounded-xl px-2 py-1.5 text-white text-xl shadow">🐟</div>
        <span className="text-[#f2658f] font-bold text-[26px] tracking-tight">NutriSi</span>
      </div>

      {/* Message */}
      <p className="text-gray-500 text-[15px] font-medium mb-8 anim-fade-up anim-d2">
        {message}{dots}
      </p>

      {/* Progress bar */}
      <div className="w-56 h-2 bg-pink-200 rounded-full overflow-hidden anim-fade-up anim-d3">
        <div className="h-full bg-[#f2658f] rounded-full transition-all duration-300 ease-out"
             style={{ width: `${progress}%` }}/>
      </div>
      <p className="text-gray-400 text-[12px] mt-2 anim-fade-up anim-d4">{Math.round(progress)}%</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ERROR PAGE — ditampilkan saat terjadi kesalahan
   ══════════════════════════════════════════════════ */
const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf`;

const ERROR_TYPES = {
  network: {
    emoji: '📡',
    title: 'Koneksi Bermasalah',
    desc:  'Periksa koneksi internet kamu dan coba lagi.',
    color: '#F97316',
  },
  notfound: {
    emoji: '🔍',
    title: 'Halaman Tidak Ditemukan',
    desc:  'Halaman yang kamu cari tidak tersedia.',
    color: '#3B82F6',
  },
  server: {
    emoji: '⚙️',
    title: 'Server Sedang Bermasalah',
    desc:  'Tim kami sedang memperbaikinya. Coba lagi dalam beberapa menit.',
    color: '#EF4444',
  },
  general: {
    emoji: '😕',
    title: 'Terjadi Kesalahan',
    desc:  'Sesuatu berjalan tidak semestinya. Coba muat ulang halaman.',
    color: '#f2658f',
  },
};

export function ErrorPage({ type = 'general', onRetry, onBack, message }) {
  const err = ERROR_TYPES[type] ?? ERROR_TYPES.general;

  return (
    <div className="font-['Poppins'] min-h-screen bg-pink-base flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <span className="absolute top-16 left-10  text-[#f2658f]/40 text-3xl select-none anim-twinkle">✦</span>
      <span className="absolute top-32 right-12 text-[#f2658f]/30 text-2xl select-none anim-twinkle-b">✦</span>
      <span className="absolute bottom-24 left-16 text-[#f2658f]/35 text-xl select-none anim-twinkle-c">✦</span>

      {/* Emoji illustration */}
      <div className="text-[80px] mb-6 anim-float-slow">{err.emoji}</div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl px-8 py-8 max-w-[380px] w-full text-center anim-scale-in anim-d1">
        <h1 className="font-bold text-[26px] text-gray-800 mb-3 leading-tight"
            style={{ color: err.color }}>{err.title}</h1>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-2">{err.desc}</p>
        {message && (
          <div className="bg-gray-50 rounded-xl px-4 py-2 mt-3 mb-4">
            <p className="text-gray-400 text-[12px] font-mono break-all">{message}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6">
          {onRetry && (
            <button onClick={onRetry}
              className="bg-[#f2658f] hover:bg-[#d94876] text-white font-semibold text-[16px]
                         h-[48px] rounded-[42px] shadow-lg transition-all hover:scale-105 active:scale-95">
              🔄 Coba Lagi
            </button>
          )}
          {onBack && (
            <button onClick={onBack}
              className="border-2 border-[#f2658f] text-[#f2658f] font-semibold text-[15px]
                         h-[48px] rounded-[42px] transition-all hover:bg-pink-50">
              ← Kembali ke Home
            </button>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 max-w-[380px] w-full anim-fade-up anim-d3">
        <p className="text-gray-400 text-[12px] text-center mb-3">Coba langkah berikut:</p>
        <div className="flex flex-col gap-2">
          {['Periksa koneksi internet kamu', 'Muat ulang halaman (refresh)', 'Hubungi support jika masalah berlanjut'].map((t,i)=>(
            <div key={i} className="flex items-center gap-2.5 bg-white/70 rounded-xl px-4 py-2.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-[#f2658f] text-[11px] font-bold
                               flex items-center justify-center flex-shrink-0">{i+1}</span>
              <span className="text-gray-600 text-[12px]">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INLINE SKELETON — loading placeholder untuk card
   ══════════════════════════════════════════════════ */
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm animate-pulse ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-pink-100 rounded-xl"/>
        <div className="flex-1">
          <div className="h-3 bg-pink-100 rounded-full w-3/4 mb-2"/>
          <div className="h-2.5 bg-pink-50 rounded-full w-1/2"/>
        </div>
      </div>
      {[...Array(lines)].map((_,i)=>(
        <div key={i} className="h-2.5 bg-pink-50 rounded-full mb-2" style={{width:`${75+i*10}%`}}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DEMO PAGE — preview semua states (akses via App)
   ══════════════════════════════════════════════════ */
export default function LoadingErrorDemo({ onBack }) {
  const [view, setView]           = useState('menu');
  const [showLoading, setShowLoading] = useState(false);

  const triggerLoading = () => {
    setShowLoading(true);
    setTimeout(() => { setShowLoading(false); setView('menu'); }, 2500);
  };

  if (showLoading) return <LoadingScreen message="Memuat data nutrisi" />;

  if (view === 'error-network')  return <ErrorPage type="network"  onRetry={() => setView('menu')} onBack={onBack} />;
  if (view === 'error-notfound') return <ErrorPage type="notfound" onBack={onBack} />;
  if (view === 'error-server')   return <ErrorPage type="server"   onRetry={() => setView('menu')} onBack={onBack} />;
  if (view === 'error-general')  return <ErrorPage type="general"  onRetry={() => setView('menu')} onBack={onBack}
                                                   message="Error 500: Internal Server Error" />;

  /* ── Menu page ── */
  return (
    <div className="font-['Poppins'] min-h-screen bg-pink-base flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">State Preview</h1>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto">
        {/* Loading section */}
        <div className="anim-fade-up anim-d0">
          <p className="text-gray-600 font-bold text-[13px] uppercase tracking-wider mb-3">⏳ Loading State</p>
          <button onClick={triggerLoading}
            className="w-full bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4
                       hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-98 border border-pink-100">
            <div className="w-11 h-11 bg-pink-100 rounded-xl flex items-center justify-center text-[22px]">⏳</div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-[14px]">Loading Screen</p>
              <p className="text-gray-400 text-[12px]">Animasi loading dengan progress bar</p>
            </div>
            <span className="ml-auto text-gray-400">›</span>
          </button>
        </div>

        {/* Skeleton section */}
        <div className="anim-fade-up anim-d1">
          <p className="text-gray-600 font-bold text-[13px] uppercase tracking-wider mb-3">💀 Skeleton Loading</p>
          <div className="flex flex-col gap-2">
            <SkeletonCard lines={2}/>
            <SkeletonCard lines={3}/>
          </div>
        </div>

        {/* Error states */}
        <div className="anim-fade-up anim-d2">
          <p className="text-gray-600 font-bold text-[13px] uppercase tracking-wider mb-3">⚠️ Error States</p>
          <div className="flex flex-col gap-2.5">
            {[
              { key:'error-network',  emoji:'📡', label:'Koneksi Bermasalah',      color:'#F97316' },
              { key:'error-notfound', emoji:'🔍', label:'Halaman Tidak Ditemukan', color:'#3B82F6' },
              { key:'error-server',   emoji:'⚙️', label:'Server Error',            color:'#EF4444' },
              { key:'error-general',  emoji:'😕', label:'Error Umum (+ pesan)',    color:'#f2658f' },
            ].map(e => (
              <button key={e.key} onClick={() => setView(e.key)}
                className="w-full bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4
                           hover:shadow-md transition-all hover:-translate-y-0.5 border border-pink-50">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
                     style={{backgroundColor: e.color+'18'}}>{e.emoji}</div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-800 text-[14px]">{e.label}</p>
                  <p className="text-gray-400 text-[12px]">Tap untuk preview</p>
                </div>
                <span className="font-bold text-[13px]" style={{color:e.color}}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
