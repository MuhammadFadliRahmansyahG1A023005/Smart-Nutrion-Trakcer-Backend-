import React, { useState, useEffect } from 'react';
import nasiImg   from '../assets/nasi.png';
import pisangImg from '../assets/pisang.png';
import cakeImg   from '../assets/cake.png';
import { api } from '../utils/api';

/* ── Icons ─────────────────────────────────────── */
const BackIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const BrainIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="1.8"><path d="M12 5C8 5 5 8 5 11c0 1.5.5 3 2 4l-1 4h12l-1-4c1.5-1 2-2.5 2-4 0-3-3-6-7-6z"/><path d="M9 11c0-1.1.9-2 2-2M14 9c.6.3 1 .9 1 1.5" strokeLinecap="round"/></svg>;
const SparkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#f2658f"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const PlusIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CheckIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf,0px 4px 0px #ffcecf,0px -4px 0px #ffcecf,4px 0px 0px #ffcecf,-4px 0px 0px #ffcecf`;

/* ── Tabs ── */
const MEAL_TABS = [
  { label:'Sarapan',     emoji:'🌅' },
  { label:'Cemilan',     emoji:'🍎' },
  { label:'Makan Siang', emoji:'☀️' },
  { label:'Makan Malam', emoji:'🌙' },
];

/* ── Rec Card ── */
function RecCard({ rec, added, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="relative h-14 flex-shrink-0" style={{backgroundColor: rec.bg || '#F89EBD'}}>
        <img src={rec.img || cakeImg} alt={rec.name}
             className="absolute -top-3 right-3 w-16 h-16 object-contain drop-shadow-md z-10"/>
      </div>
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-bold text-gray-800 text-[13px] leading-snug pr-2">{rec.name}</p>
          <button onClick={onAdd}
            disabled={added}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        transition-all shadow-sm text-white
                        ${added ? 'bg-[#22C55E]' : 'bg-[#f2658f] hover:bg-[#d94876] hover:scale-110 active:scale-95'}`}>
            {added ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
        <div className="flex gap-2 mb-2.5">
          <span className="text-[11px] text-gray-500">{rec.kkal} kkal</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-500">{rec.protein}g protein</span>
        </div>
        <div className="bg-amber-50 rounded-xl px-3 py-2 mb-2.5">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <span className="font-bold">💡 Mengapa: </span>{rec.why}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {rec.tags.map((t,i) => (
            <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#f2658f]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function Rekomendasi({ onBack, onNavigate, user }) {
  const [activeTab, setActiveTab] = useState(0);
  const [added, setAdded]         = useState({});
  const [activeNav, setActiveNav] = useState(2);
  const [deficiencies, setDeficiencies] = useState([]);
  const [recs, setRecs]           = useState({
    "Sarapan": [],
    "Cemilan": [],
    "Makan Siang": [],
    "Makan Malam": []
  });
  const [loading, setLoading]     = useState(true);

  const dateStr = '2026-05-15'; // Sync date standard
  const childName = user?.childProfile?.namaAnak || 'Anak';

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/recommendations?date=${dateStr}`);
      if (res.data) {
        setDeficiencies(res.data.deficiencies || []);
        
        // Map images dynamically based on index fallbacks
        const mappedRecs = {};
        const mealTypes = ["Sarapan", "Cemilan", "Makan Siang", "Makan Malam"];
        
        mealTypes.forEach(meal => {
          const rawItems = res.data.recommendations[meal] || [];
          mappedRecs[meal] = rawItems.map((item, idx) => {
            const assets = [cakeImg, pisangImg, nasiImg];
            return {
              ...item,
              img: assets[idx % assets.length]
            };
          });
        });
        
        setRecs(mappedRecs);
      }
    } catch (err) {
      console.error('Failed to fetch AI recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const handleAddRecommended = async (rec, tabLabel) => {
    try {
      // Find matching food base to preserve dynamic custom calculations
      const payload = {
        date: dateStr,
        mealType: tabLabel,
        gram: 100, // standard serving
        customFood: {
          id: 'AI_REC_' + Date.now().toString(36),
          name: rec.name,
          kkal: rec.kkal,
          protein: rec.protein,
          kalsium: rec.kalsium || 0,
          zatBesi: rec.zatBesi || 0,
          kalium: rec.kalium || 0,
          vitC: rec.vitC || 0,
          fat: 0,
          carbohydrate: 0,
          water: 0
        }
      };

      await api.post('/api/logs', payload);
      
      const key = `${tabLabel}-${rec.name}`;
      setAdded(prev => ({ ...prev, [key]: true }));
      
      // Dynamic refresh deficiency rates
      const refreshRes = await api.get(`/api/recommendations?date=${dateStr}`);
      if (refreshRes.data) {
        setDeficiencies(refreshRes.data.deficiencies || []);
      }
    } catch (err) {
      alert(err.message || 'Gagal mencatat makanan.');
    }
  };

  const mealLabels = ["Sarapan", "Cemilan", "Makan Siang", "Makan Malam"];
  const currentTabLabel = mealLabels[activeTab];
  const currentRecsList = recs[currentTabLabel] || [];

  const MobileView = () => (
    <div className="bg-pink-base min-h-screen flex flex-col">
      <div className="px-5 pt-6 pb-3 flex items-center gap-3 anim-fade-up anim-d0">
        <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors"><BackIcon /></button>
        <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">Rekomendasi Menu</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-4 flex flex-col gap-4">
        
        {/* Model Badge */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3 anim-scale-in anim-d1">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center"><BrainIcon /></div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-bold text-gray-800 text-[13px]">Model AI Aktif</p>
              <SparkIcon />
            </div>
            <p className="text-gray-500 text-[11px]">Personalisasi berdasarkan profil & defisiensi gizi {childName}</p>
          </div>
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0 shadow-sm"/>
        </div>

        {/* Deficiencies */}
        <div className="flex flex-col gap-2 anim-fade-up anim-d2">
          {deficiencies.map((d, i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
              <span className="text-[20px]">{d.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-semibold text-gray-700">{d.label}</span>
                  <span className="text-[11px] font-medium" style={{color:d.color}}>{d.note}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{width:`${d.pct}%`, backgroundColor:d.color}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Meal tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar anim-fade-up anim-d3">
          {MEAL_TABS.map((t,i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold
                          whitespace-nowrap transition-all flex-shrink-0
                          ${activeTab===i ? 'bg-[#f2658f] text-white shadow' : 'bg-white text-gray-600 hover:text-[#f2658f]'}`}>
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Rec cards list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center py-6 text-gray-400 text-[13px]">Memuat rekomendasi AI...</p>
          ) : currentRecsList.map((rec, i) => (
            <div key={i} className="anim-fade-up" style={{animationDelay:`${i*80}ms`}}>
              <RecCard 
                rec={rec} 
                added={!!added[`${currentTabLabel}-${rec.name}`]} 
                onAdd={() => handleAddRecommended(rec, currentTabLabel)}
              />
            </div>
          ))}
          {!loading && currentRecsList.length === 0 && (
            <p className="text-center py-6 text-gray-400 text-[13px]">Semua gizi tercukupi, tidak ada rekomendasi menu penyeimbang khusus!</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
        <BottomNav active={activeNav} onSelect={i => { setActiveNav(i); onNavigate?.(i); }} />
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
      <span className="absolute top-10 left-10  text-[#f2658f]/40 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
      <span className="absolute top-40 right-[52%] text-[#f2658f]/30 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
      <span className="absolute bottom-20 left-[28%] text-[#f2658f]/35 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
      <span className="absolute top-[55%] right-12 text-[#f2658f]/25 text-4xl select-none anim-twinkle-d pointer-events-none">✦</span>

      {/* Panel Kiri */}
      <div className="w-[42%] h-full flex flex-col px-12 xl:px-16 py-8 overflow-y-auto no-scrollbar relative z-10">
        <div className="flex items-center justify-between mb-8 anim-fade-left anim-d0">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#f2658f] transition-colors text-[14px] font-medium">
            <BackIcon /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#f2658f] rounded-xl px-1.5 py-1.5 text-white text-xl shadow-md">🐟</div>
            <span className="text-[#f2658f] font-bold text-[20px]">NutriSi</span>
          </div>
        </div>

        <h1 className="text-[44px] xl:text-[54px] font-bold mb-4 leading-[48px] xl:leading-[58px]
                       tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d1"
            style={{textShadow:stickerShadow}}>
          <span className="block">Rekomendasi</span>
          <span className="block">Menu</span>
          <span className="block">Cerdas</span>
        </h1>
        <p className="text-gray-600 text-[15px] max-w-[360px] mb-6 leading-relaxed anim-fade-left anim-d2">
          Saran menu dipersonalisasi menggunakan model ML berdasarkan defisiensi nutrisi harian {childName}.
        </p>

        {/* Model info card */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-pink-100 mb-5 anim-scale-in anim-d3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center"><BrainIcon /></div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-gray-800 text-[14px]">Model AI Aktif</p>
                <SparkIcon />
              </div>
              <p className="text-gray-400 text-[11px]">Diperbarui hari ini</p>
            </div>
            <span className="ml-auto w-3 h-3 bg-green-400 rounded-full shadow"/>
          </div>
          <div className="flex flex-col gap-2">
            {[`Analisis profil ${childName} ✓`,'Deteksi defisiensi nutrisi ✓','Personalisasi 1.146 bahan makanan ✓'].map((t,i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2658f]"/> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Deficiencies */}
        <p className="font-bold text-gray-700 text-[13px] mb-3 uppercase tracking-wider anim-fade-up anim-d4">
          Nutrisi yang Perlu Dipenuhi
        </p>
        <div className="flex flex-col gap-2.5 mb-5">
          {deficiencies.map((d, i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-pink-50
                                    flex items-center gap-3 anim-fade-left"
                 style={{animationDelay:`${(i+5)*80}ms`}}>
              <span className="text-[22px]">{d.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-semibold text-gray-700">{d.label}</span>
                  <span className="text-[11px] font-semibold" style={{color:d.color}}>{d.note}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                       style={{width:`${d.pct}%`, backgroundColor:d.color}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto anim-fade-up anim-d7">
          <BottomNav active={activeNav} onSelect={i => { setActiveNav(i); onNavigate?.(i); }}/>
        </div>
      </div>

      {/* Panel Kanan */}
      <div className="w-[58%] h-full flex flex-col px-8 xl:px-12 py-8 overflow-y-auto no-scrollbar relative z-10">
        <h2 className="text-gray-800 font-bold text-[20px] mb-4 anim-fade-right anim-d0">Pilih Waktu Makan</h2>

        <div className="flex gap-2 mb-5 anim-fade-up anim-d1">
          {MEAL_TABS.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-semibold
                          transition-all border
                          ${activeTab===i
                            ? 'bg-[#f2658f] text-white border-[#f2658f] shadow-md'
                            : 'bg-white text-gray-600 border-pink-100 hover:border-[#f2658f] hover:text-[#f2658f]'}`}>
              <span className="text-[16px]">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {loading ? (
            <p className="col-span-2 text-center py-10 text-gray-400 text-[14px]">Memuat rekomendasi AI...</p>
          ) : currentRecsList.map((rec, i) => (
            <div key={`${currentTabLabel}-${i}`} className="anim-scale-in" style={{animationDelay:`${i*80}ms`}}>
              <RecCard 
                rec={rec} 
                added={!!added[`${currentTabLabel}-${rec.name}`]} 
                onAdd={() => handleAddRecommended(rec, currentTabLabel)}
              />
            </div>
          ))}
          {!loading && currentRecsList.length === 0 && (
            <p className="col-span-2 text-center py-10 text-gray-400 text-[14px]">Semua gizi tercukupi, tidak ada rekomendasi menu penyeimbang khusus!</p>
          )}

          <div className="border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center
                          justify-center p-6 text-center gap-2 opacity-60">
            <span className="text-3xl">🍽️</span>
            <p className="text-gray-400 text-[12px]">Tambahkan makanan dari Log Makanan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-['Poppins']">
      <div className="lg:hidden"><MobileView /></div>
      <DesktopView />
    </div>
  );
}
