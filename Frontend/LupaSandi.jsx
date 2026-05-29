import React, { useState } from 'react';

/* ── Icons ─────────────────────────────────────── */
const BackIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const MailIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/></svg>;
const CheckCircle = () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const LockSvg   = () => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="1.4"><rect x="3" y="11" width="18" height="12" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="#f2658f" stroke="none"/></svg>;
const ShieldIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const KeyIcon   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="2" strokeLinecap="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l2 2M18 5l2 2"/></svg>;
const TimeIcon  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>;

const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf,0px 4px 0px #ffcecf,0px -4px 0px #ffcecf,4px 0px 0px #ffcecf,-4px 0px 0px #ffcecf`;

const TIPS = [
  { icon: <ShieldIcon />, title: 'Aman & Terenkripsi',  desc: 'Link reset dikirim dengan enkripsi aman ke emailmu.' },
  { icon: <KeyIcon />,    title: 'Satu Kali Pakai',     desc: 'Link hanya bisa digunakan sekali dan berlaku 30 menit.' },
  { icon: <TimeIcon />,   title: 'Cepat & Mudah',       desc: 'Proses reset password selesai dalam hitungan menit.' },
];

export default function LupaSandi({ onBack, onKeLogin }) {
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = () => {
    if (!email.includes('@')) { setError('Masukkan alamat email yang valid.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  /* ── Shared Form/Success panel ─────────────────── */
  const FormPanel = () => (
    <div className="w-full flex flex-col items-center">
      {!submitted ? (
        /* ── FORM STATE ── */
        <div className="w-full">
          {/* Illustration (mobile only) */}
          <div className="lg:hidden flex justify-center mb-8 anim-scale-in anim-d0">
            <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center anim-float">
              <LockSvg />
            </div>
          </div>

          <div className="bg-[#f39ab4] w-full lg:max-w-[460px] rounded-t-[40px] lg:rounded-[32px]
                          px-7 pt-10 pb-10 flex flex-col items-center
                          lg:shadow-2xl lg:anim-glow-pulse
                          anim-slide-up anim-d1">

            <h2 className="text-[36px] lg:text-[32px] font-bold text-[#f2658f] mb-2 tracking-tight"
                style={{ textShadow: stickerShadow }}>
              Lupa Sandi?
            </h2>
            <p className="text-white/90 text-[14px] text-center mb-8 leading-relaxed max-w-[300px]">
              Masukkan email akunmu, kami akan kirimkan link untuk reset kata sandi.
            </p>

            <div className="w-full max-w-[320px] flex flex-col gap-y-4">
              <div className="flex flex-col w-full">
                <label className="text-[#000] text-[15px] font-medium mb-1 ml-2">Email</label>
                <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><MailIcon /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="nama@email.com"
                    className="w-full h-[51px] rounded-[42px] pl-12 pr-5
                               text-[14px] font-medium text-gray-800
                               outline-none shadow-[0_0_7px_3px_#f2658f]
                               focus:ring-2 focus:ring-white transition-all"
                  />
                </div>
                {error && <p className="text-red-600 text-[12px] ml-3 mt-1">{error}</p>}
              </div>
            </div>

            <div className="mt-8 w-full max-w-[320px]">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#f2658f] hover:bg-[#d94876] disabled:opacity-70
                           text-white font-medium text-[18px]
                           w-full h-[51px] rounded-[42px] shadow-lg
                           transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Mengirim...</>
                  : 'Kirim Link Reset'}
              </button>
            </div>

            <button onClick={onBack ?? onKeLogin}
                    className="mt-5 text-[#000] text-[14px] font-medium underline hover:text-[#f2658f] transition-colors">
              Kembali ke Login
            </button>
          </div>
        </div>
      ) : (
        /* ── SUCCESS STATE ── */
        <div className="w-full flex flex-col items-center anim-scale-in anim-d0">
          <div className="bg-[#f39ab4] w-full lg:max-w-[460px] rounded-t-[40px] lg:rounded-[32px]
                          px-7 pt-10 pb-10 flex flex-col items-center lg:shadow-2xl">
            <div className="mb-6 anim-scale-in anim-d1">
              <CheckCircle />
            </div>
            <h2 className="text-[32px] font-bold text-[#f2658f] mb-3"
                style={{ textShadow: stickerShadow }}>Email Terkirim!</h2>
            <p className="text-white/90 text-[14px] text-center mb-2 leading-relaxed max-w-[300px]">
              Kami sudah mengirimkan link reset password ke
            </p>
            <p className="text-white font-bold text-[15px] mb-6">{email}</p>
            <p className="text-white/80 text-[12px] text-center mb-8 max-w-[280px]">
              Silakan cek inbox atau folder spam. Link berlaku selama <strong>30 menit</strong>.
            </p>
            <button
              onClick={onBack ?? onKeLogin}
              className="bg-[#f2658f] hover:bg-[#d94876] text-white font-medium text-[17px]
                         w-full max-w-[296px] h-[51px] rounded-[42px] shadow-lg
                         transition-all hover:scale-105 active:scale-95 mb-4">
              Kembali ke Login
            </button>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="text-[#000] text-[13px] underline hover:text-[#f2658f] transition-colors">
              Coba dengan email lain
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="font-['Poppins']">

      {/* ══════ MOBILE ══════ */}
      <div className="lg:hidden bg-pink-base min-h-screen flex flex-col relative overflow-hidden">
        {/* Bintang */}
        <span className="absolute top-14 left-8  text-[#f2658f] text-2xl select-none anim-twinkle">✦</span>
        <span className="absolute top-32 right-10 text-[#f2658f] text-xl select-none anim-twinkle-b">✦</span>
        <span className="absolute bottom-24 left-12 text-[#f2658f] text-lg select-none anim-twinkle-c">✦</span>

        {/* Header */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-3 anim-fade-up anim-d0">
          <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors">
            <BackIcon />
          </button>
          <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">Lupa Kata Sandi</h1>
        </div>

        <div className="flex flex-col flex-1 justify-end">
          <FormPanel />
        </div>
      </div>

      {/* ══════ DESKTOP ══════ */}
      <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
        {/* Bintang */}
        <span className="absolute top-12 left-10 text-[#f2658f]/50 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-36 right-[52%] text-[#f2658f]/35 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-20 left-20 text-[#f2658f]/40 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
        <span className="absolute top-[40%] right-14 text-[#f2658f]/30 text-4xl select-none anim-twinkle-d pointer-events-none">✦</span>

        {/* ── KIRI ── */}
        <div className="w-[54%] h-full flex flex-col justify-center items-start px-16 xl:px-24 py-10 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 anim-fade-left anim-d0">
            <div className="bg-[#f2658f] rounded-2xl px-2 py-2 text-white text-2xl shadow-md">🐟</div>
            <span className="text-[#f2658f] font-bold text-[24px] tracking-tight">NutriSi</span>
          </div>

          {/* Illustration */}
          <div className="mb-8 anim-scale-in anim-d1">
            <div className="w-32 h-32 bg-white/70 rounded-full shadow-lg flex items-center justify-center anim-float">
              <LockSvg />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[54px] xl:text-[64px] font-bold mb-4 leading-[58px] xl:leading-[68px]
                         tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d2"
              style={{ textShadow: stickerShadow }}>
            <span className="block">Lupa</span>
            <span className="block">Kata</span>
            <span className="block">Sandi?</span>
          </h1>

          <p className="text-gray-600 text-[16px] font-medium max-w-[400px] mb-8 leading-relaxed anim-fade-left anim-d3">
            Jangan khawatir! Kami akan membantu kamu mendapatkan kembali akses ke akunmu dengan cepat dan aman.
          </p>

          {/* Tips cards */}
          <div className="flex flex-col gap-3 w-full max-w-[440px]">
            {TIPS.map((t, i) => (
              <div key={i}
                   className="flex items-start gap-3 bg-white/80 rounded-2xl px-4 py-3 shadow-sm
                              border border-pink-100 hover:shadow-md transition-all anim-fade-left"
                   style={{ animationDelay: `${(i + 4) * 80}ms` }}>
                <span className="flex-shrink-0 mt-0.5">{t.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-[13px]">{t.title}</p>
                  <p className="text-gray-500 text-[12px] leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── KANAN ── */}
        <div className="w-[46%] h-full flex flex-col justify-center items-center px-10 py-10 relative z-10">
          <FormPanel />
        </div>
      </div>
    </div>
  );
}
