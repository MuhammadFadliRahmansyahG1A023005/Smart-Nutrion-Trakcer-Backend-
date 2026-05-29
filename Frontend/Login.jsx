import React, { useState } from 'react';
import fishIcon from '../assets/ikan2.png';
import { api } from '../utils/api';

const stickerShadow = `
  3px 3px 0px #ffcecf, -3px -3px 0px #ffcecf,
  3px -3px 0px #ffcecf, -3px 3px 0px #ffcecf,
  0px 4px 0px #ffcecf, 0px -4px 0px #ffcecf,
  4px 0px 0px #ffcecf, -4px 0px 0px #ffcecf
`;

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const features = [
  { icon: '🥗', title: 'Pantau Gizi Harian',       desc: 'Catat makanan anak & lihat ringkasan nutrisi setiap hari.' },
  { icon: '📈', title: 'Lacak Tumbuh Kembang',      desc: 'Pantau berat, tinggi, dan perkembangan anak secara berkala.' },
  { icon: '🎯', title: 'Rekomendasi Menu Sehat',    desc: 'Saran menu yang disesuaikan dengan kebutuhan gizi anak.' },
];

const stats = [
  { val: '10.000+', label: 'Orang Tua' },
  { val: '50+',     label: 'Menu Sehat' },
  { val: '4.9★',    label: 'Rating' },
];

export default function Login({ onKeRegister, onLupaSandi, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username: email, password });
      api.setToken(res.token);
      localStorage.setItem('nutrisi_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      font-['Poppins'] bg-pink-base relative overflow-hidden
      flex flex-col justify-end items-center min-h-screen
      lg:flex-row lg:justify-start lg:items-stretch lg:h-screen lg:overflow-hidden lg:min-h-0
    `}>

      {/* ─────────────────────────────────────────────────────────
          KIRI — hanya desktop
          ───────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[56%] flex-col justify-center items-start
                      lg:px-12 xl:px-20 lg:py-8 relative z-10 lg:h-full lg:overflow-hidden">

        {/* Bintang dekoratif — twinkle */}
        <span className="absolute top-10 left-8   text-[#f2658f] text-3xl select-none anim-twinkle">✦</span>
        <span className="absolute top-28 right-12 text-[#f2658f] text-2xl select-none anim-twinkle-b">✦</span>
        <span className="absolute bottom-20 left-14 text-[#f2658f] text-xl select-none anim-twinkle-c">✦</span>
        <span className="absolute top-[52%] right-8 text-[#f2658f] text-4xl select-none anim-twinkle-d">✦</span>
        <span className="absolute bottom-12 right-20 text-[#f2658f] text-lg select-none anim-twinkle">✦</span>

        {/* Logo */}
        <div className="flex items-center gap-3 lg:mb-6 anim-fade-left anim-d0">
          <div className="bg-[#f2658f] rounded-2xl px-2 py-2 text-white text-2xl shadow-md">🐟</div>
          <span className="text-[#f2658f] font-bold text-[24px] tracking-tight">NutriSi</span>
        </div>

        {/* Headline */}
        <h1
          className="text-[50px] xl:text-[60px] font-bold lg:mb-4 leading-[54px] xl:leading-[65px]
                     tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d2"
          style={{ textShadow: stickerShadow }}
        >
          <span className="block">Selamat</span>
          <span className="block">Datang</span>
          <span className="block">Kembali!</span>
        </h1>

        {/* Deskripsi */}
        <p className="text-gray-600 text-[15px] xl:text-[16px] font-medium max-w-[380px]
                      lg:mb-6 leading-relaxed anim-fade-left anim-d3">
          Pantau asupan gizi anak dengan lebih mudah dan bantu tumbuh kembangnya setiap hari.
        </p>

        {/* Feature cards */}
        <div className="flex flex-col gap-2 w-full max-w-[440px] lg:mb-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-2xl
                         px-4 py-3 shadow-sm border border-pink-100
                         hover:shadow-md hover:border-pink-200 hover:-translate-y-0.5
                         transition-all duration-200 cursor-default
                         anim-fade-left"
              style={{ animationDelay: `${(i + 4) * 80}ms` }}
            >
              <span className="text-[22px] flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-[13px] mb-0.5">{f.title}</p>
                <p className="text-gray-500 text-[12px] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-4 anim-fade-up anim-d8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/80 border border-pink-100 rounded-2xl
                                    px-4 py-2 text-center shadow-sm
                                    hover:shadow-md transition-shadow duration-200">
              <p className="text-[#f2658f] font-bold text-[17px] leading-tight">{s.val}</p>
              <p className="text-gray-500 text-[11px] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          KANAN — ikan + kartu form
          ───────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[46%] xl:w-[44%]
                      flex flex-col justify-end items-center
                      lg:justify-center lg:h-full lg:py-6
                      relative z-10">

        {/* Maskot ikan — float */}
        <img
          src={fishIcon}
          alt="Maskot Ikan"
          className="w-[520px] lg:w-[200px] xl:w-[240px]
                     relative z-10 -mb-20 lg:-mb-14
                     drop-shadow-xl
                     hover:translate-y-[-10px] transition-transform duration-300
                     anim-float"
        />

        {/* Kartu pink */}
        <form onSubmit={handleLogin} className="bg-[#f39ab4] w-full lg:max-w-[420px]
                        h-[580px] lg:h-auto
                        rounded-t-[40px] lg:rounded-[32px]
                        px-8 lg:px-7 pt-16 lg:pt-10 pb-10 lg:pb-7
                        flex flex-col items-center
                        relative z-20
                        lg:shadow-2xl lg:mb-0
                        anim-slide-up anim-d2
                        lg:anim-glow-pulse">

          <h2
            className="text-[42px] lg:text-[34px] font-bold text-[#f2658f]
                       mb-6 lg:mb-3 leading-[39px] tracking-[1px]"
            style={{ textShadow: stickerShadow }}
          >
            Masuk
          </h2>

          {error && (
            <div className="w-full max-w-[330px] lg:max-w-[310px] bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-[12px] font-semibold mb-4 text-center leading-tight">
              {error}
            </div>
          )}

          <div className="w-full max-w-[330px] lg:max-w-[310px] flex flex-col gap-y-4 lg:gap-y-3">

            <div className="flex flex-col w-full">
              <label className="text-[#000] text-[16px] lg:text-[14px] font-medium mb-1 ml-2">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[51px] lg:h-[46px] rounded-[42px] px-6
                           text-[14px] lg:text-[13px] font-medium text-gray-800
                           outline-none shadow-[0_0_7px_3px_#f2658f]
                           focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-[#000] text-[16px] lg:text-[14px] font-medium mb-1 ml-2">Kata Sandi</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[51px] lg:h-[46px] rounded-[42px] pl-6 pr-14
                             text-[14px] lg:text-[13px] font-medium text-gray-800
                             outline-none shadow-[0_0_7px_3px_#f2658f]
                             focus:ring-2 focus:ring-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            <button type="button" onClick={onLupaSandi}
                    className="text-[#000] text-[15px] lg:text-[13px] font-medium underline
                               text-right mt-1 mb-4 lg:mb-2
                               hover:text-[#f2658f] transition-colors self-end">
              Lupa Sandi?
            </button>
          </div>

          {/* Spacer mobile saja */}
          <div className="flex-grow lg:hidden"></div>
          <div className="hidden lg:block lg:mt-4"></div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-[#f2658f] hover:bg-[#d94876] text-white font-medium
                             text-[20px] lg:text-[17px]
                             w-full max-w-[296px] lg:max-w-[280px]
                             h-[51px] lg:h-[46px]
                             rounded-[42px] shadow-lg
                             transition transform hover:scale-105 active:scale-95
                             mb-5 lg:mb-4 flex items-center justify-center disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-[#000] text-[16px] lg:text-[14px] font-medium mb-4 lg:mb-0">
            Belum Punya Akun?{' '}
            <button
              type="button"
              onClick={onKeRegister}
              className="font-bold underline hover:text-[#f2658f] transition-colors"
            >
              Daftar
            </button>
          </p>
        </form>
      </div>

    </div>
  );
}
