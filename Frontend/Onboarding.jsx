import React from 'react';
import tomatoIcon from '../assets/tomat.png';
import chickIcon  from '../assets/ayam.png';

const stickerShadow = `
  3px 3px 0px #ffcecf, -3px -3px 0px #ffcecf,
  3px -3px 0px #ffcecf, -3px 3px 0px #ffcecf,
  0px 4px 0px #ffcecf, 0px -4px 0px #ffcecf,
  4px 0px 0px #ffcecf, -4px 0px 0px #ffcecf
`;

const features = [
  { icon: '🥗', label: 'Gizi Harian' },
  { icon: '📊', label: 'Grafik Tumbuh' },
  { icon: '🍱', label: 'Menu Sehat' },
  { icon: '⏰', label: 'Pengingat Makan' },
];

const stats = [
  { val: '10.000+', label: 'Orang Tua' },
  { val: '50+',     label: 'Menu Sehat' },
  { val: '4.9★',    label: 'Rating' },
];

export default function Onboarding({ onMulai }) {
  return (
    /*
     * ROOT
     * Mobile  : flex-col, justify-between (tidak berubah)
     * Desktop : flex-row, h-screen, overflow-hidden
     */
    <div className={`
      font-['Poppins'] bg-pink-base relative overflow-hidden
      flex flex-col items-center justify-between
      px-6 py-12 min-h-screen
      lg:flex-row lg:px-20 xl:px-28
      lg:h-screen lg:overflow-hidden lg:min-h-0 lg:py-0 lg:items-stretch
    `}>

      {/* Bintang dekoratif — twinkle (ada di mobile + desktop) */}
      <span className="absolute top-16 left-10   text-[#f2658f] opacity-60 text-2xl lg:text-4xl  lg:top-20 lg:left-20    select-none anim-twinkle">✦</span>
      <span className="absolute top-32 right-12  text-[#f2658f] opacity-60 text-3xl lg:text-5xl  lg:top-28 lg:right-32   select-none anim-twinkle-b">✦</span>
      <span className="absolute top-[40%] left-6 text-[#f2658f] opacity-50 text-xl  lg:text-3xl  lg:left-[23%] lg:top-[30%] select-none anim-twinkle-c">✦</span>
      <span className="absolute top-[50%] right-8 text-[#f2658f] opacity-60 text-2xl              lg:right-[28%] lg:top-[55%] select-none anim-twinkle-d">✦</span>
      <span className="absolute bottom-48 left-12 text-[#f2658f] opacity-60 text-3xl lg:bottom-32 lg:left-1/3 select-none anim-twinkle">✦</span>
      <span className="absolute bottom-24 right-10 text-[#f2658f] opacity-50 text-xl lg:text-3xl lg:bottom-24 lg:right-24 select-none anim-twinkle-b">✦</span>
      <span className="absolute top-20 left-1/2   text-[#f2658f] opacity-40 text-lg  lg:text-2xl  lg:top-16 lg:left-[44%] select-none anim-twinkle-c">✦</span>

      {/* ─────────────────────────────────────────────────────────
          KIRI — teks + CTA
          Mobile  : centered, full-width, mt-20 (TIDAK BERUBAH)
          Desktop : kiri, tengah vertikal
          ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center
                      lg:items-start lg:text-left
                      z-10 w-full lg:w-[50%] xl:w-[48%]
                      mt-20 lg:mt-0
                      lg:justify-center lg:h-full lg:pr-8 xl:pr-12">

        {/* Logo — hanya desktop */}
        <div className="hidden lg:flex items-center gap-3 lg:mb-6 anim-fade-left anim-d0">
          <div className="bg-[#f2658f] rounded-2xl px-2 py-2 text-white text-2xl shadow-md">🐟</div>
          <span className="text-[#f2658f] font-bold text-[24px] tracking-tight">NutriSi</span>
        </div>

        {/* Headline */}
        <h1
          className="text-[45px] lg:text-[62px] xl:text-[74px] font-bold mb-6
                     leading-[45px] lg:leading-[68px] xl:leading-[80px]
                     tracking-[-1px] text-[#f2658f] italic
                     anim-fade-left anim-d1"
          style={{ textShadow: stickerShadow }}
        >
          <span className="block">Tumbuh</span>
          <span className="block">Sehat</span>
          <span className="block">Bersama</span>
        </h1>

        {/* Deskripsi */}
        <p className="text-[#000] text-[18px] lg:text-[16px] xl:text-[18px] font-medium
                      max-w-[333px] lg:max-w-[420px]
                      z-20 mb-2 lg:mb-6 lg:leading-relaxed
                      anim-fade-left anim-d3">
          Pantau asupan gizi anak dengan lebih mudah dan bantu tumbuh kembangnya setiap hari.
        </p>

        {/* Feature badges — hanya desktop */}
        <div className="hidden lg:grid grid-cols-2 gap-2 w-full max-w-[420px] lg:mb-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/80 border border-pink-100 rounded-2xl
                         px-4 py-2.5 shadow-sm
                         hover:shadow-md hover:-translate-y-0.5 hover:border-pink-200
                         transition-all duration-200 cursor-default
                         anim-scale-in"
              style={{ animationDelay: `${(i + 4) * 80}ms` }}
            >
              <span className="text-[20px]">{f.icon}</span>
              <span className="text-gray-700 font-semibold text-[13px]">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Stats — hanya desktop */}
        <div className="hidden lg:flex gap-4 lg:mb-8 anim-fade-up anim-d7">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/80 border border-pink-100 rounded-2xl
                                    px-4 py-2 text-center shadow-sm
                                    hover:shadow-md transition-shadow duration-200">
              <p className="text-[#f2658f] font-bold text-[17px] leading-tight">{s.val}</p>
              <p className="text-gray-500 text-[11px] font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tombol Mulai — hanya desktop */}
        <button
          onClick={onMulai}
          className="hidden lg:block bg-[#f2658f] hover:bg-[#d94876] text-white font-medium
                     text-[20px] py-3.5 px-16 rounded-[42px] shadow-lg
                     transition transform hover:scale-105 active:scale-95
                     w-full max-w-[300px]
                     anim-scale-in anim-d8"
        >
          Mulai Sekarang
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────
          KANAN — maskot + tombol mobile
          Mobile  : maskot tengah + tombol bawah (TIDAK BERUBAH)
          Desktop : maskot mengisi kolom kanan
          ───────────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-[50%] xl:w-[52%]
                      flex flex-col items-center justify-between
                      flex-grow lg:flex-none lg:justify-center lg:h-full">

        {/* Wadah maskot */}
        <div className="relative w-full max-w-[350px] lg:max-w-[560px]
                        h-48 md:h-64 lg:h-[520px] xl:h-[580px]
                        my-auto lg:my-0 z-10">

          {/* Tomat — float lambat */}
          <img
            src={tomatoIcon}
            alt="Tomat"
            className="w-[160px] md:w-44 lg:w-[260px] xl:w-72
                       absolute -bottom-22 -left-20
                       lg:bottom-8 lg:-left-6
                       drop-shadow-xl lg:drop-shadow-2xl
                       anim-float-slow"
          />

          {/* Ayam — float dengan sway */}
          <img
            src={chickIcon}
            alt="Anak Ayam"
            className="w-[160px] md:w-48 lg:w-[340px] xl:w-[380px]
                       absolute -bottom-12 -right-22
                       lg:top-8 lg:-right-10
                       drop-shadow-xl lg:drop-shadow-2xl
                       anim-float-sway"
          />
        </div>

        {/* Tombol Mulai — hanya mobile (TIDAK BERUBAH) */}
        <button
          onClick={onMulai}
          className="lg:hidden mb-14 bg-[#f2658f] hover:bg-[#d94876] text-white font-medium
                     text-[20px] py-3 rounded-[42px] shadow-lg
                     transition transform hover:scale-105 active:scale-95
                     w-full max-w-[296px] z-20 mt-auto"
        >
          Mulai
        </button>
      </div>

    </div>
  );
}
