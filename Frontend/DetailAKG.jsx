import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

/* ── Icons ─────────────────────────────────────── */
const BackIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf,0px 4px 0px #ffcecf,0px -4px 0px #ffcecf,4px 0px 0px #ffcecf,-4px 0px 0px #ffcecf`;

const TABS = ['Hari Ini', 'Minggu Ini', 'Bulan Ini'];

const getStatus = (pct) => {
  if (pct >= 100) return { label: 'Sangat Baik', color: '#22C55E' };
  if (pct >=  80) return { label: 'Baik',        color: '#3B82F6' };
  if (pct >=  50) return { label: 'Cukup',       color: '#F97316' };
  return             { label: 'Rendah',      color: '#EF4444' };
};

/* ── Donut ──────────────────────────────────────── */
function DonutChart({ pct, size = 130, sw = 14 }) {
  const { label, color } = getStatus(pct);
  const r = size/2 - sw - 2, cx = size/2;
  const cir = 2*Math.PI*r, dash = Math.min(pct,100)/100*cir;
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ECECEC" strokeWidth={sw}/>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${cir-dash}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}/>
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-bold" style={{color, fontSize:size*0.165}}>{pct}%</span>
        <span className="font-semibold mt-1 text-center" style={{color:'#888', fontSize:size*0.095}}>{label}</span>
      </div>
    </div>
  );
}

/* ── Nutrient Card ───────────────────────────────── */
function NutriCard({ n, expanded, onToggle }) {
  const pct = Math.round((n.val / n.max) * 100);
  const { label, color } = getStatus(pct);
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-pink-50
                     overflow-hidden transition-all duration-300 cursor-pointer
                     hover:shadow-md hover:-translate-y-0.5`}
         onClick={onToggle}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[17px] flex-shrink-0"
             style={{backgroundColor: n.bg}}>{n.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-semibold text-gray-800 text-[13px]">{n.label}</span>
            <span className="font-bold text-[12px]" style={{color}}>{label}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
                 style={{width:`${Math.min(pct,100)}%`, backgroundColor:color}}/>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-400 text-[10px]">{n.val} {n.unit}</span>
            <span className="text-gray-400 text-[10px]">{n.max} {n.unit}</span>
          </div>
        </div>
        <span className={`text-gray-400 transition-transform ${expanded?'rotate-90':''}`}>›</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-pink-50 bg-pink-50/30 anim-fade-up anim-d0">
          <p className="text-gray-600 text-[12px] leading-relaxed mb-2">{n.desc}</p>
          <div className="flex items-start gap-2 bg-[#fff7f0] rounded-xl px-3 py-2">
            <span className="text-[#F97316] text-[14px] mt-0.5">💡</span>
            <p className="text-[#b45309] text-[11px] leading-relaxed font-medium">{n.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function DetailAKG({ onBack, onNavigate, user }) {
  const [activeTab,    setActiveTab]    = useState(0);
  const [expandedIdx,  setExpandedIdx]  = useState(null);
  const [totals,       setTotals]       = useState({ kkal:0, protein:0, kalsium:0, zatBesi:0, kalium:0 });
  const [history,      setHistory]      = useState([]);

  const dateStr = '2026-05-15'; // Sync date standard

  const profile = user?.childProfile || {
    namaAnak: 'Alya',
    tanggalLahir: '2022-04-15',
    jenisKelamin: 'perempuan',
    tinggiBadan: 102,
    beratBadan: 16,
  };

  const akg = user?.akgTargets || {
    kkal: 1125,
    protein: 30,
    kalsium: 850,
    zatBesi: 30,
    kalium: 650,
  };

  // Calculate age dynamically
  const ageYears = useMemo(() => {
    const birthDate = new Date(profile.tanggalLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} tahun` : '1 tahun';
  }, [profile.tanggalLahir]);

  const fetchDailyTotals = async () => {
    try {
      const res = await api.get(`/api/logs?date=${dateStr}`);
      setTotals(res.totals || { kkal:0, protein:0, kalsium:0, zatBesi:0, kalium:0 });
    } catch (err) {
      console.error('Error fetching logs inside DetailAKG:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/logs/history');
      setHistory(res || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchDailyTotals();
    fetchHistory();
  }, [user]);

  const NUTRIENTS = [
    { emoji:'⚡', bg:'#FFF7CC', label:'Energi',      val: Math.round(totals.kkal), max: akg.kkal, unit:'kkal',
      desc:'Energi dibutuhkan untuk aktivitas harian dan pertumbuhan anak.',
      tip:'Tambahkan nasi atau roti gandum untuk mencukupi kebutuhan energi.' },
    { emoji:'🍗', bg:'#FFE4EC', label:'Protein',     val: Math.round(totals.protein), max: akg.protein, unit:'gram',
      desc:'Protein penting untuk pembentukan otot dan jaringan tubuh anak.',
      tip:'Konsumsi telur, ayam, atau ikan untuk meningkatkan asupan protein.' },
    { emoji:'💧', bg:'#E0F3FF', label:'Kalium',      val: Math.round(totals.kalium), max: akg.kalium, unit:'mg',
      desc:'Kalium menjaga keseimbangan cairan dan fungsi jantung anak.',
      tip:'Buah dan sayuran segar adalah sumber kalium yang baik.' },
    { emoji:'🌿', bg:'#E7F8E7', label:'Zat Besi',    val: Math.round(totals.zatBesi), max: akg.zatBesi, unit:'mg',
      desc:'Zat besi mencegah anemia dan mendukung perkembangan otak anak.',
      tip:'Perbanyak sayur bayam, tempe, dan kacang-kacangan.' },
    { emoji:'🦷', bg:'#F0E8FF', label:'Kalsium',     val: Math.round(totals.kalsium), max: akg.kalsium, unit:'mg',
      desc:'Kalsium untuk pembentukan tulang dan gigi yang kuat.',
      tip:'Susu, keju, dan yogurt adalah sumber kalsium terbaik.' },
  ];

  const overallPct = Math.round(
    NUTRIENTS.reduce((acc, curr) => acc + (curr.val / curr.max), 0) / NUTRIENTS.length * 100
  );

  const toggleExpand = (i) => setExpandedIdx(expandedIdx===i ? null : i);

  /* ── Weekly Bar Chart ── */
  const WEEKLY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const defaultWeeklyHeights = [72, 88, 65, 91, 85, 79, 85];
  
  const getWeeklyPct = (dayIdx) => {
    if (history.length > 0) {
      const histDay = history[history.length - 7 + dayIdx] || history[dayIdx];
      if (histDay) {
        return Math.min(Math.round((histDay.kkal / akg.kkal) * 100), 100);
      }
    }
    return defaultWeeklyHeights[dayIdx];
  };

  const WeeklyChart = () => (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
      <p className="font-bold text-gray-800 text-[14px] mb-4">Tren Mingguan</p>
      <div className="flex gap-2 items-end" style={{height:80}}>
        {WEEKLY_LABELS.map((day, i) => {
          const pct = getWeeklyPct(i);
          const { color } = getStatus(pct);
          const isToday = i === 6;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold" style={{color: isToday? color:'#aaa'}}>{pct}%</span>
              <div className="w-full max-w-[32px] rounded-t-lg transition-all duration-500"
                   style={{
                     height: `${(pct/100)*56}px`,
                     backgroundColor: isToday ? color : color+'60',
                     outline: isToday ? `2px solid ${color}` : 'none'
                   }}/>
              <span className="text-[10px] text-gray-500">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ── Child Card ── */
  const ChildCard = () => (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
        {profile.jenisKelamin === 'perempuan' ? '👧' : '👦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-[16px] truncate">{profile.namaAnak}</p>
        <p className="text-gray-500 text-[11px] leading-tight mt-0.5">
          {ageYears} · {profile.beratBadan} kg · {profile.tinggiBadan} cm · {profile.jenisKelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[#f2658f] font-bold text-[14px]">{overallPct}%</p>
        <p className="text-gray-400 text-[10px]">AKG Hari Ini</p>
      </div>
    </div>
  );

  /* ── Left Panel Content (Desktop) ── */
  const LeftContent = () => (
    <>
      <div className="flex items-center gap-3 mb-8 anim-fade-left anim-d0">
        <div className="bg-[#f2658f] rounded-2xl px-2 py-2 text-white text-2xl shadow-md">🐟</div>
        <span className="text-[#f2658f] font-bold text-[22px] tracking-tight">NutriSi</span>
      </div>
      <h1 className="text-[48px] xl:text-[58px] font-bold mb-4 leading-[52px] xl:leading-[62px]
                     tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d1"
          style={{textShadow: stickerShadow}}>
        <span className="block">Detail</span>
        <span className="block">AKG</span>
        <span className="block">{profile.namaAnak}</span>
      </h1>
      <p className="text-gray-600 text-[15px] font-medium max-w-[380px] mb-6 leading-relaxed anim-fade-left anim-d2">
        Angka Kecukupan Gizi (AKG) harian anak berdasarkan usia, berat badan, dan tinggi badan.
      </p>

      {/* Big Donut */}
      <div className="flex items-center gap-6 bg-white/80 rounded-3xl px-6 py-5 shadow-sm
                      border border-pink-100 mb-5 anim-scale-in anim-d3">
        <DonutChart pct={overallPct} size={140} sw={14}/>
        <div>
          <p className="text-gray-500 text-[12px] mb-1 uppercase tracking-wider font-semibold">Total AKG</p>
          <p className="text-gray-800 font-bold text-[28px] leading-none">{overallPct}%</p>
          <p className="text-gray-500 text-[13px] mt-1">dari kebutuhan harian</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {NUTRIENTS.slice(0, 4).map((n, i) => {
              const pct = Math.round((n.val/n.max)*100);
              const {color} = getStatus(pct);
              return (
                <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{backgroundColor:color+'20',color}}>
                  {n.emoji} {pct}%
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="anim-fade-up anim-d4"><ChildCard /></div>
      <div className="mt-4 anim-fade-up anim-d5"><WeeklyChart /></div>
    </>
  );

  /* ── Right Panel Content (Desktop) ── */
  const RightContent = () => (
    <>
      <div className="flex gap-2 bg-white/70 rounded-full p-1 mb-5 w-fit anim-scale-in anim-d0">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all
              ${activeTab===i ? 'bg-[#f2658f] text-white shadow' : 'text-gray-500 hover:text-[#f2658f]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto no-scrollbar">
        {NUTRIENTS.map((n, i) => (
          <div key={i} className="anim-fade-up" style={{animationDelay:`${i*60}ms`}}>
            <NutriCard n={n} expanded={expandedIdx===i} onToggle={()=>toggleExpand(i)}/>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="font-['Poppins']">

      {/* ══════ MOBILE ══════ */}
      <div className="lg:hidden bg-pink-base min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3 anim-fade-up anim-d0">
          <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors"><BackIcon /></button>
          <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">Detail AKG</h1>
        </div>

        <div className="px-5 pb-8 flex flex-col gap-4 overflow-y-auto">
          <div className="anim-fade-up anim-d1"><ChildCard /></div>

          <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-5 anim-scale-in anim-d2">
            <DonutChart pct={overallPct} size={110} sw={12}/>
            <div>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Total AKG Hari Ini</p>
              <p className="text-gray-800 font-bold text-[26px] leading-none">{overallPct}%</p>
              <p className="text-gray-400 text-[12px] mt-1">dari kebutuhan harian</p>
            </div>
          </div>

          <div className="flex gap-2 bg-white/70 rounded-full p-1 w-fit anim-scale-in anim-d3">
            {TABS.map((t,i) => (
              <button key={i} onClick={()=>setActiveTab(i)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all
                  ${activeTab===i?'bg-[#f2658f] text-white shadow':'text-gray-500'}`}>{t}</button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {NUTRIENTS.map((n,i) => (
              <div key={i} className="anim-fade-up" style={{animationDelay:`${i*50}ms`}}>
                <NutriCard n={n} expanded={expandedIdx===i} onToggle={()=>toggleExpand(i)}/>
              </div>
            ))}
          </div>

          <div className="anim-fade-up anim-d6"><WeeklyChart /></div>
        </div>
      </div>

      {/* ══════ DESKTOP ══════ */}
      <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
        <span className="absolute top-10 left-8  text-[#f2658f]/40 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute bottom-20 left-[35%] text-[#f2658f]/30 text-xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute top-[40%] right-12 text-[#f2658f]/25 text-2xl select-none anim-twinkle-c pointer-events-none">✦</span>

        {/* ── KIRI ── */}
        <div className="w-[48%] h-full flex flex-col px-12 xl:px-16 py-8 overflow-y-auto no-scrollbar relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#f2658f]
                                              transition-colors text-[14px] font-medium mb-6 w-fit">
            <BackIcon /> Kembali
          </button>
          <LeftContent />
        </div>

        {/* ── KANAN ── */}
        <div className="w-[52%] h-full flex flex-col px-10 xl:px-14 py-8 overflow-y-auto no-scrollbar relative z-10">
          <div className="mb-4 anim-fade-right anim-d0">
            <h2 className="text-gray-800 font-bold text-[22px]">Breakdown Nutrisi</h2>
            <p className="text-gray-500 text-[13px]">Klik setiap nutrisi untuk melihat tips pemenuhan.</p>
          </div>
          <RightContent />
        </div>
      </div>
    </div>
  );
}
