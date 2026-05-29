import React, { useState } from 'react';
import { api } from '../utils/api';

/* ─── sticker shadow persis seperti halaman lain ─── */
const stickerShadow = `
  3px 3px 0px #ffcecf, -3px -3px 0px #ffcecf,
  3px -3px 0px #ffcecf, -3px 3px 0px #ffcecf,
  0px 4px 0px #ffcecf, 0px -4px 0px #ffcecf,
  4px 0px 0px #ffcecf, -4px 0px 0px #ffcecf
`;

/* ─── ChevronDown ─── */
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 pointer-events-none">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

/* ─── Input putih pill dengan pink glow ─── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <span className="text-[#000] text-[15px] font-medium ml-1">{label}</span>
      {children}
    </div>
  );
}

const inputClass =
  'w-full h-[48px] rounded-[42px] px-5 bg-white outline-none ' +
  'text-[14px] font-medium text-gray-500 placeholder-gray-400 ' +
  'shadow-[0_0_0_3px_rgba(242,101,143,0.35)] ' +
  'focus:shadow-[0_0_0_3px_rgba(242,101,143,0.6)] transition-all';

function TInput({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={inputClass}
    />
  );
}

function TSelect({ value, onChange, options }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className={inputClass + ' appearance-none pr-10 cursor-pointer'}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={!!o.disabled}>{o.label}</option>
        ))}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <ChevronDown />
      </span>
    </div>
  );
}

/* ─── Progress dots: pill aktif, titik kecil lainnya ─── */
function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-400 ${
            i === current
              ? 'w-8 h-[10px] bg-[#f2658f]'
              : 'w-[10px] h-[10px] bg-[#f2658f]/25'
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Konfigurasi per step ─── */
const STEPS = [
  {
    title: 'Senang bertemu\ndenganmu',
    desc: 'Mari mulai dengan membuat profil anak terlebih dahulu.',
    /* desktop kiri */
    dTitle: ['Senang', 'Bertemu', 'Denganmu!'],
    dDesc: 'Kami senang kamu bergabung. Yuk mulai buat profil anak kamu agar kami bisa memberikan rekomendasi gizi yang tepat.',
    dTips: [
      { icon: '🔒', text: 'Data aman & terlindungi' },
      { icon: '🎯', text: 'Rekomendasi lebih personal' },
      { icon: '💡', text: 'Bisa diubah kapan saja' },
    ],
  },
  {
    title: 'Informasi Dasar\nAnak',
    desc: 'Isi data dasar anak untuk memulai pemantauan nutrisi.',
    dTitle: ['Informasi', 'Dasar', 'Anak'],
    dDesc: 'Usia dan jenis kelamin anak digunakan untuk menghitung kebutuhan gizi harian secara akurat.',
    dTips: [
      { icon: '🧒', text: 'Usia menentukan kebutuhan gizi' },
      { icon: '⚖️', text: 'Jenis kelamin memengaruhi kalori' },
      { icon: '📅', text: 'Dihitung otomatis dari tanggal lahir' },
    ],
  },
  {
    title: 'Data Pertumbuhan',
    desc: 'Data tinggi dan berat badan digunakan untuk analisis status gizi anak.',
    dTitle: ['Data', 'Pertum-', 'buhan'],
    dDesc: 'Pantau grafik tumbuh kembang anak berdasarkan tinggi dan berat badan yang kamu masukkan.',
    dTips: [
      { icon: '📊', text: 'Pantau grafik tumbuh kembang' },
      { icon: '🏥', text: 'Analisis BMI otomatis' },
      { icon: '📈', text: 'Update rutin setiap bulan' },
    ],
  },
  {
    title: 'Kebutuhan Khusus',
    desc: 'Tambahkan alergi atau kondisi tertentu agar rekomendasi lebih sesuai.',
    dTitle: ['Kebu-', 'tuhan', 'Khusus'],
    dDesc: 'Informasi alergi dan kondisi khusus membantu kami menyaring menu yang aman dan sesuai untuk anak.',
    dTips: [
      { icon: '🚫', text: 'Filter bahan alergen otomatis' },
      { icon: '🍽️', text: 'Menu disesuaikan kondisi anak' },
      { icon: '✅', text: 'Semua data bersifat opsional' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function Personalisasi({ onSelesai }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    namaAnak: '',
    tanggalLahir: '',
    jenisKelamin: '',
    tinggiBadan: '',
    beratBadan: '',
    alergi: '',
    kondisiKhusus: '',
  });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleComplete = async () => {
    try {
      const payload = {
        namaAnak: form.namaAnak,
        tanggalLahir: form.tanggalLahir,
        jenisKelamin: form.jenisKelamin,
        tinggiBadan: parseFloat(form.tinggiBadan) || 0,
        beratBadan: parseFloat(form.beratBadan) || 0,
        alergi: form.alergi || '-',
        kondisiKhusus: form.kondisiKhusus || '-'
      };
      
      const res = await api.post('/api/auth/personalize', payload);
      
      // Update local storage user profile
      const storedUser = JSON.parse(localStorage.getItem('nutrisi_user') || '{}');
      storedUser.childProfile = res.childProfile;
      storedUser.akgTargets = res.akgTargets;
      localStorage.setItem('nutrisi_user', JSON.stringify(storedUser));
      
      onSelesai(storedUser);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil anak.');
    }
  };

  const handleNext = () => {
    // Basic validation
    if (step === 0 && !form.namaAnak) {
      setError('Nama anak wajib diisi.');
      return;
    }
    if (step === 1 && (!form.tanggalLahir || !form.jenisKelamin)) {
      setError('Tanggal lahir dan jenis kelamin wajib diisi.');
      return;
    }
    if (step === 2 && (!form.tinggiBadan || !form.beratBadan)) {
      setError('Tinggi dan berat badan wajib diisi.');
      return;
    }

    setError('');
    if (step === 3) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  /* ─── Form fields sesuai step ─── */
  const renderFields = () => {
    if (step === 0) return (
      <Field label="Nama anak">
        <TInput placeholder="Nama anak" value={form.namaAnak} onChange={set('namaAnak')} />
      </Field>
    );
    if (step === 1) return (
      <>
        <Field label="Tanggal Lahir">
          <TInput type="date" placeholder="hh/bb/tttt" value={form.tanggalLahir} onChange={set('tanggalLahir')} />
        </Field>
        <Field label="Jenis Kelamin">
          <TSelect
            value={form.jenisKelamin}
            onChange={set('jenisKelamin')}
            options={[
              { value: '', label: 'jenis kelamin', disabled: true },
              { value: 'laki', label: 'Laki-laki' },
              { value: 'perempuan', label: 'Perempuan' },
            ]}
          />
        </Field>
      </>
    );
    if (step === 2) return (
      <>
        <Field label="Tinggi Badan">
          <TInput type="number" placeholder="tinggi badan(cm)" value={form.tinggiBadan} onChange={set('tinggiBadan')} />
        </Field>
        <Field label="Berat Badan">
          <TInput type="number" placeholder="berat badan(kg)" value={form.beratBadan} onChange={set('beratBadan')} />
        </Field>
      </>
    );
    if (step === 3) return (
      <>
        <Field label="Alergi">
          <TSelect
            value={form.alergi}
            onChange={set('alergi')}
            options={[
              { value: '', label: 'alergi', disabled: true },
              { value: 'susu',     label: 'Susu' },
              { value: 'telur',    label: 'Telur' },
              { value: 'kacang',   label: 'Kacang' },
              { value: 'seafood',  label: 'Seafood' },
              { value: 'gluten',   label: 'Gluten' },
              { value: 'lainnya',  label: 'Lainnya' },
            ]}
          />
        </Field>
        <Field label="Kondisi Khusus">
          <TSelect
            value={form.kondisiKhusus}
            onChange={set('kondisiKhusus')}
            options={[
              { value: '', label: 'kondisi khusus', disabled: true },
              { value: 'picky_eater',       label: 'Picky Eater' },
              { value: 'underweight',       label: 'Underweight' },
              { value: 'lactose_intolerant',label: 'Lactose Intolerant' },
              { value: 'anemia',            label: 'Anemia' },
              { value: 'lainnya',           label: 'Lainnya' },
            ]}
          />
        </Field>
      </>
    );
  };

  const info = STEPS[step];
  const isLast = step === 3;

  /* ─── Konten kanan / mobile (reusable) ─── */
  const MobileContent = () => (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Konten utama — di-tengah vertikal */}
      <div className="flex-1 flex flex-col justify-center px-8">

        {/* Judul */}
        <h1
          key={`t${step}`}
          className="text-[40px] font-bold text-[#f2658f] italic
                     leading-[44px] tracking-[-1px] mb-3
                     anim-fade-up anim-d0"
          style={{ textShadow: stickerShadow, whiteSpace: 'pre-line' }}
        >
          {info.title}
        </h1>

        {/* Deskripsi */}
        <p
          key={`d${step}`}
          className="text-[#333] text-[14px] font-medium leading-snug
                     mb-5 max-w-[300px] anim-fade-up anim-d1"
        >
          {info.desc}
        </p>

        {/* Kotak pink berisi form fields */}
        <div
          key={`f${step}`}
          className="bg-[#f39ab4] rounded-[18px] px-5 py-5
                     flex flex-col gap-4 mb-6
                     anim-fade-up anim-d2"
        >
          {renderFields()}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-[12px] font-semibold mb-4 text-center leading-tight">
            {error}
          </div>
        )}

        {/* Tombol selanjutnya / selesai */}
        <button
          key={`b${step}`}
          onClick={handleNext}
          className="bg-[#f2658f] hover:bg-[#d94876] text-white font-medium
                     text-[17px] h-[46px] px-10 rounded-[42px]
                     shadow-md transition-all hover:scale-105 active:scale-95
                     anim-fade-up anim-d3"
        >
          {isLast ? 'selesai' : 'selanjutnya'}
        </button>
      </div>

      {/* Progress dots — pinned bawah */}
      <div className="pb-10 pt-4 flex justify-center anim-fade-up anim-d4">
        <ProgressDots total={4} current={step} />
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="font-['Poppins'] bg-pink-base relative overflow-hidden
                    flex flex-col min-h-screen
                    lg:flex-row lg:h-screen lg:min-h-0 lg:overflow-hidden">

      {/* Bintang dekoratif */}
      <span className="absolute top-12 left-8    text-[#f2658f]/50 text-2xl select-none anim-twinkle">✦</span>
      <span className="absolute top-24 right-10  text-[#f2658f]/50 text-3xl select-none anim-twinkle-b">✦</span>
      <span className="absolute top-[42%] left-5 text-[#f2658f]/40 text-xl  select-none anim-twinkle-c lg:hidden">✦</span>
      <span className="absolute top-[32%] right-6 text-[#f2658f]/40 text-lg select-none anim-twinkle-d lg:hidden">✦</span>
      {/* desktop extra */}
      <span className="hidden lg:block absolute top-[45%] left-[25%] text-[#f2658f]/40 text-2xl select-none anim-twinkle-c">✦</span>
      <span className="hidden lg:block absolute bottom-20 left-12          text-[#f2658f]/40 text-xl  select-none anim-twinkle">✦</span>
      <span className="hidden lg:block absolute bottom-16 right-[47%]     text-[#f2658f]/40 text-lg  select-none anim-twinkle-b">✦</span>

      {/* ══ PANEL KIRI desktop ══ */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[54%]
                      flex-col justify-center items-start
                      px-14 xl:px-20 py-10 relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-7 anim-fade-left anim-d0">
          <div className="bg-[#f2658f] rounded-2xl px-2 py-2 text-white text-2xl shadow-md">🐟</div>
          <span className="text-[#f2658f] font-bold text-[24px] tracking-tight">NutriSi</span>
        </div>

        {/* Headline desktop */}
        <h1
          key={`dh${step}`}
          className="text-[54px] xl:text-[66px] font-bold mb-4
                     leading-[58px] xl:leading-[72px] tracking-[-2px]
                     text-[#f2658f] italic anim-fade-left anim-d1"
          style={{ textShadow: stickerShadow }}
        >
          {info.dTitle.map((l, i) => <span key={i} className="block">{l}</span>)}
        </h1>

        <p key={`dd${step}`}
           className="text-gray-600 text-[15px] xl:text-[16px] font-medium
                      max-w-[400px] mb-7 leading-relaxed anim-fade-left anim-d2">
          {info.dDesc}
        </p>

        {/* Stepper */}
        <div className="flex items-center mb-7 anim-fade-up anim-d3">
          {['Nama', 'Data Dasar', 'Pertumbuhan', 'Kebutuhan'].map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                 font-bold text-[13px] shadow transition-all duration-300
                                 ${i < step  ? 'bg-[#f2658f] text-white'
                                 : i === step ? 'bg-[#f2658f] text-white ring-4 ring-[#f2658f]/25'
                                              : 'bg-white text-[#f2658f]/50 border-2 border-[#f2658f]/30'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-semibold text-center max-w-[58px] leading-tight
                                  ${i === step ? 'text-[#f2658f]' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className={`w-8 h-0.5 mb-5 transition-all duration-500
                                 ${i < step ? 'bg-[#f2658f]' : 'bg-[#f2658f]/20'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tips */}
        <div key={`dt${step}`} className="flex flex-col gap-2.5 w-full max-w-[420px]">
          {info.dTips.map((tip, i) => (
            <div key={i}
                 className="flex items-center gap-3 bg-white/70 backdrop-blur-sm
                            rounded-2xl px-4 py-3 shadow-sm border border-[#f2658f]/20
                            hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                            anim-fade-left"
                 style={{ animationDelay: `${(i + 4) * 80}ms` }}>
              <span className="text-[20px]">{tip.icon}</span>
              <span className="text-gray-700 font-medium text-[13px]">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PANEL KANAN desktop / full-screen mobile ══ */}
      <div className="flex-1 lg:w-[48%] xl:w-[46%] flex flex-col
                      lg:justify-center lg:px-12 xl:px-16 lg:py-10">

        {/* ── MOBILE layout (persis desain) ── */}
        <div className="lg:hidden flex flex-col flex-1 min-h-screen">
          <MobileContent />
        </div>

        {/* ── DESKTOP layout (sama strukturnya, tanpa top spacer) ── */}
        <div className="hidden lg:flex flex-col">

          {/* Judul */}
          <h1
            key={`rh${step}`}
            className="text-[36px] font-bold text-[#f2658f] italic
                       leading-[40px] tracking-[-1px] mb-2 anim-fade-up anim-d0"
            style={{ textShadow: stickerShadow, whiteSpace: 'pre-line' }}
          >
            {info.title}
          </h1>

          <p key={`rd${step}`}
             className="text-[#333] text-[14px] font-medium leading-snug
                        mb-5 max-w-[360px] anim-fade-up anim-d1">
            {info.desc}
          </p>

          {/* Kotak pink form */}
          <div key={`rf${step}`}
               className="bg-[#f39ab4] rounded-[18px] px-6 py-5
                          flex flex-col gap-4 mb-6
                          anim-fade-up anim-d2">
            {renderFields()}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-[12px] font-semibold mb-4 text-center leading-tight w-fit">
              {error}
            </div>
          )}

          {/* Tombol */}
          <button
            onClick={handleNext}
            className="bg-[#f2658f] hover:bg-[#d94876] text-white font-medium
                       text-[17px] h-[46px] px-10 rounded-[42px] w-fit
                       shadow-md transition-all hover:scale-105 active:scale-95 mb-6
                       anim-fade-up anim-d3">
            {isLast ? 'selesai' : 'selanjutnya'}
          </button>

          {/* Dots */}
          <div className="anim-fade-up anim-d4">
            <ProgressDots total={4} current={step} />
          </div>
        </div>
      </div>

    </div>
  );
}
