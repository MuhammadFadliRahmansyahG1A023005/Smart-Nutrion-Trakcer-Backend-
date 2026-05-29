import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

/* ════════════════════════════════════════════════════════════
   ICONS
   ════════════════════════════════════════════════════════════ */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>;
const XIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevLeft   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const PinIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const CheckIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const TrashIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ════════════════════════════════════════════════════════════ */

/* ── Bottom nav pill ── */
function BottomNav({ active = 2, onSelect }) {
  const items = [HomeIcon, ClockIcon, MenuIcon, PersonIcon];
  return (
    <div className="flex justify-center">
      <div className="bg-[#f2658f] rounded-full px-2.5 py-2 flex items-center gap-1.5 shadow-xl">
        {items.map((Icon, i) => (
          <button key={i} onClick={() => onSelect?.(i)}
            type="button"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
              ${i === active ? 'bg-white text-[#f2658f] shadow' : 'text-white/90 hover:text-white'}`}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Header bar ── */
function PageHeader({ onBack }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <button onClick={onBack}
        type="button"
        className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
        <ChevLeft /> Kembali
      </button>
      <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Log Makanan</h1>
      <button type="button" className="text-gray-400 hover:text-[#f2658f] transition-colors">
        <PinIcon />
      </button>
    </div>
  );
}

/* ── "Daily Nutrition Plan" + meal badge ── */
function PlanBar({ meal, onMealChange }) {
  const meals = ['Sarapan', 'Cemilan', 'Makan Siang', 'Makan Malam'];
  const colors = {
    'Sarapan':    { bg:'#7C6AE8', text:'white' },
    'Cemilan':    { bg:'#34B47E', text:'white' },
    'Makan Siang':{ bg:'#F97316', text:'white' },
    'Makan Malam':{ bg:'#3B82F6', text:'white' },
  };
  const c = colors[meal] || colors['Sarapan'];
  return (
    <div className="px-5 pb-3 flex items-center gap-3">
      <span className="text-gray-700 font-semibold text-[14px]">Daily Nutrition Plan</span>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {meals.map((m) => (
          <button key={m}
            type="button"
            onClick={() => onMealChange(m)}
            className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all whitespace-nowrap
              ${m === meal ? 'shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            style={m === meal ? { backgroundColor: c.bg, color: c.text } : {}}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Search bar ── */
function SearchBar({ query, onChange, onClear, onSubmit }) {
  return (
    <div className="mx-5 mb-1">
      <form onSubmit={onSubmit} className="relative flex items-center bg-white rounded-[42px] border border-gray-100
                      shadow-[0_2px_12px_rgba(0,0,0,0.07)] px-4 h-[44px]">
        <span className="text-gray-400 flex-shrink-0 mr-2.5"><SearchIcon /></span>
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari Bahan Makanan..."
          className="flex-1 outline-none text-[13px] text-gray-700 placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button type="button" onClick={onClear}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0
                       w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <XIcon />
          </button>
        )}
      </form>
    </div>
  );
}

/* ── Kalkulasi nutrisi per gram ── */
const calc = (food, gram) => ({
  kkal:    parseFloat((food.kkal    * gram / 100).toFixed(1)),
  protein: parseFloat((food.protein * gram / 100).toFixed(1)),
  kalsium: parseFloat((food.kalsium * gram / 100).toFixed(1)),
  zatBesi: parseFloat((food.zatBesi * gram / 100).toFixed(1)),
});

/* ════════════════════════════════════════════════════════════
   VIEW 1 — DAFTAR HASIL PENCARIAN
   ════════════════════════════════════════════════════════════ */
function FoodResultList({ results, selectedId, onToggle }) {
  if (results.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-8">
      <span className="text-5xl mb-3">🔍</span>
      <p className="text-gray-500 font-medium text-[14px]">Makanan tidak ditemukan</p>
      <p className="text-gray-400 text-[12px] mt-1">Coba kata kunci lain</p>
    </div>
  );
  return (
    <div className="flex flex-col pb-16">
      {results.map((food) => {
        const checked = selectedId === food.id;
        return (
          <button key={food.id}
            type="button"
            onClick={() => onToggle(food)}
            className="flex items-center justify-between px-5 py-3.5
                       border-b border-gray-100 hover:bg-pink-50/50 transition-colors text-left w-full">
            <div>
              <p className="text-gray-800 font-semibold text-[14px] leading-tight">{food.name}</p>
              <p className="text-[#f2658f] text-[11px] mt-0.5 font-medium">
                {food.kkal} kkal · {food.protein}g protein · {food.kalsium}mg kalsium / 100g
              </p>
            </div>
            <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0 ml-3 border-2 transition-all
              ${checked ? 'bg-[#f2658f] border-[#f2658f]' : 'border-gray-300 bg-white'}`}>
              {checked && <CheckIcon />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VIEW 2 — INPUT DETAIL MAKANAN
   ════════════════════════════════════════════════════════════ */
function FoodDetailInput({ food, onAdd, onBack }) {
  const [unit, setUnit]   = useState('Gram');
  const [gram, setGram]   = useState(50);
  const units = ['Gram', 'Sendok Makan', 'Sendok Teh'];
  const unitFactor = { 'Gram':1, 'Sendok Makan':15, 'Sendok Teh':5 };
  const gramVal = gram * (unit === 'Gram' ? 1 : unitFactor[unit]);
  const n = calc(food, gramVal);

  return (
    <div className="mx-5 my-3 bg-white rounded-[22px] shadow-sm overflow-hidden border border-gray-100">
      {/* Food header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-[#f2658f] text-[11px] font-semibold mb-2 hover:underline">
          <ChevLeft /> Kembali ke Hasil Cari
        </button>
        <p className="text-gray-800 font-bold text-[16px] leading-tight">{food.name}</p>
        <p className="text-[#f2658f] text-[11px] font-medium mt-0.5">
          {food.kkal} kkal · {food.protein}g protein · {food.kalsium}mg kalsium / 100g
        </p>
        <div className="mt-3 w-16 h-0.5 bg-gray-200 rounded mx-auto" />
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Pilih Satuan */}
        <div>
          <p className="text-gray-700 font-semibold text-[13px] mb-2">Pilih Satuan</p>
          <div className="flex gap-2">
            {units.map((u) => (
              <button key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`flex-1 py-2 rounded-[42px] text-[12px] font-semibold transition-all
                  ${unit === u
                    ? 'bg-[#f2658f] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Jumlah */}
        <div>
          <p className="text-gray-700 font-semibold text-[13px] mb-2">Jumlah</p>
          <div className="flex items-center bg-gray-50 rounded-[14px] border border-gray-200 px-4 h-[46px] w-[100px]">
            <input
              type="number"
              value={gram}
              onChange={(e) => setGram(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent outline-none text-center text-[15px] font-bold text-gray-800"
            />
          </div>
        </div>

        {/* Kandungan Nutrisi */}
        <div>
          <p className="text-gray-700 font-semibold text-[13px] mb-2">Kandungan Nutrisi</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:'Energi',  val: n.kkal,    unit:'kkal' },
              { label:'Protein', val: n.protein,  unit:'g'   },
              { label:'Kalsium', val: n.kalsium,  unit:'mg'  },
              { label:'Zat Besi',val: n.zatBesi,  unit:'mg'  },
            ].map((item) => (
              <div key={item.label}
                   className="bg-[#fce4ec] rounded-[14px] px-4 py-3 text-center">
                <p className="text-gray-600 text-[11px] font-medium">{item.label}</p>
                <p className="text-gray-800 font-bold text-[16px] mt-0.5">
                  {item.val} <span className="text-[11px] font-medium text-gray-500">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tambahkan button */}
        <button
          type="button"
          onClick={() => onAdd(food, gramVal)}
          className="w-full h-[50px] rounded-[42px] bg-[#f2658f] hover:bg-[#d94876]
                     text-white font-semibold text-[16px]
                     shadow-md transition-all hover:scale-[1.02] active:scale-95">
          Tambahkan
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VIEW 3 — DAFTAR MENU + TOTAL GIZI
   ════════════════════════════════════════════════════════════ */
function MenuSummary({ menu, onRemove, totals, target, deficiencies }) {
  const kkalPct = Math.min(Math.round(totals.kkal / target.kkal * 100), 100);
  const kkalColor = kkalPct >= 90 ? '#22C55E' : kkalPct >= 60 ? '#F97316' : '#EF4444';

  return (
    <div className="px-5 flex flex-col gap-4 pb-16">

      {/* ── Daftar Menu ── */}
      <div>
        <p className="text-gray-800 font-bold text-[15px] mb-2.5">Daftar Menu</p>
        <div className="flex flex-col gap-2">
          {menu.map((log, i) => (
            <div key={log.id || i}
                 className="bg-white rounded-[16px] px-4 py-3.5 flex items-center
                            justify-between shadow-sm border border-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold text-[14px] leading-tight truncate">{log.food.name}</p>
                <p className="text-[#f2658f] text-[11px] font-medium mt-0.5">
                  {log.nutrition?.kkal || log.food.kkal} kkal · {log.nutrition?.protein || log.food.protein}g protein · {log.nutrition?.kalsium || log.food.kalsium}mg kalsium
                  {' · '}<span className={kkalPct >= 90 ? 'text-green-500' : 'text-orange-400'}>
                    {kkalPct >= 90 ? 'Sangat Baik' : kkalPct >= 60 ? 'Cukup' : 'Kurang'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <span className="text-[#f2658f] font-bold text-[15px]">{log.gram}gr</span>
                <button type="button" onClick={() => onRemove(log.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Total Gizi ── */}
      <div>
        <p className="text-gray-800 font-bold text-[15px] mb-2.5">Total Gizi</p>
        <div className="bg-white rounded-[16px] px-4 py-4 shadow-sm border border-gray-50
                        flex items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-y-2.5 gap-x-4">
            {[
              { emoji:'⚡', bg:'#FFF7CC', label:'Energi',   val:totals.kkal.toFixed(0),    max:target.kkal,    unit:'kkal' },
              { emoji:'💧', bg:'#E0F3FF', label:'Kalium',   val:totals.kalium.toFixed(0), max:target.kalium, unit:'mg'   },
              { emoji:'🍗', bg:'#FFE4EC', label:'Protein',  val:totals.protein.toFixed(0), max:target.protein, unit:'gram' },
              { emoji:'🌿', bg:'#E7F8E7', label:'Zat Besi', val:totals.zatBesi.toFixed(0), max:target.zatBesi, unit:'mg'   },
            ].map((n) => (
              <div key={n.label} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
                     style={{ backgroundColor: n.bg }}>
                  {n.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 font-medium leading-none">{n.label}</p>
                  <p className="text-[11px] text-gray-700 font-semibold leading-tight">
                    {n.val} / {n.max} <span className="font-normal text-gray-400">{n.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center
                          border-l border-gray-100 pl-4">
            <p className="font-bold text-[28px] leading-none" style={{ color: kkalColor }}>
              {Math.round(totals.kkal)}
            </p>
            <p className="text-gray-500 text-[11px] font-medium mt-0.5">kkal</p>
          </div>
        </div>
      </div>

      {/* ── Rekomendasi ── */}
      <div>
        <p className="text-gray-800 font-bold text-[15px] mb-2.5">Rekomendasi AI</p>
        <div className="bg-white rounded-[16px] px-4 py-4 shadow-sm border border-gray-50 min-h-[80px]
                        flex flex-col gap-2">
          {deficiencies.slice(0, 2).map((def, idx) => (
            def.pct < 80 && (
              <div key={idx} className="flex items-center gap-2.5 bg-[#fff3cd] rounded-xl px-3 py-2.5">
                <span className="text-[16px]">{def.emoji}</span>
                <p className="text-[#856404] text-[12px] font-semibold leading-tight">
                  {def.label} kurang! {def.note}. Coba klik tab "Rekomendasi" untuk saran menu khusus.
                </p>
              </div>
            )
          ))}
          {kkalPct >= 80 && (
            <div className="flex items-center gap-2.5 bg-[#d4edda] rounded-xl px-3 py-2.5">
              <span className="text-[16px]">✅</span>
              <p className="text-[#155724] text-[12px] font-semibold leading-tight">
                Kebutuhan energi harian anak tercukupi dengan baik, hebat!
              </p>
            </div>
          )}
          {menu.length === 0 && (
            <p className="text-gray-400 text-[13px] text-center py-2">
              Tambahkan makanan untuk melihat rekomendasi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DESKTOP — PANEL KIRI (search + hasil / daftar)
   ════════════════════════════════════════════════════════════ */
function DesktopLeft({ query, onChange, onClear, onSubmit, view, results, selectedFood, onToggle, menu, onRemove }) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 px-1">
        <form onSubmit={onSubmit} className="relative flex items-center bg-white rounded-[42px] border border-gray-100
                        shadow-[0_2px_12px_rgba(0,0,0,0.07)] px-4 h-[46px]">
          <span className="text-gray-400 flex-shrink-0 mr-2.5"><SearchIcon /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cari Bahan Makanan..."
            className="flex-1 outline-none text-[13px] text-gray-700 placeholder-gray-400 bg-transparent"
          />
          {query && (
            <button type="button" onClick={onClear}
              className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0
                         w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <XIcon />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl bg-white shadow-sm border border-gray-100 custom-scrollbar">
        {view === 'summary' ? (
          <div className="p-4 flex flex-col gap-3 pb-16">
            <p className="text-gray-800 font-bold text-[15px]">Daftar Menu</p>
            {menu.map((log, i) => (
              <div key={log.id || i} className="bg-[#fce4ec]/40 rounded-[14px] px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-[14px] truncate">{log.food.name}</p>
                  <p className="text-[#f2658f] text-[11px] font-medium mt-0.5">
                    {log.nutrition?.kkal || log.food.kkal} kkal · {log.nutrition?.protein || log.food.protein}g protein · {log.nutrition?.kalsium || log.food.kalsium}mg kalsium
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className="text-[#f2658f] font-bold text-[15px]">{log.gram}gr</span>
                  <button type="button" onClick={() => onRemove(log.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
            {menu.length === 0 && (
              <p className="text-gray-400 text-[13px] text-center py-6">Belum ada makanan ditambahkan</p>
            )}
          </div>
        ) : query ? (
          <FoodResultList results={results} selectedId={selectedFood?.id} onToggle={onToggle} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
            <span className="text-6xl mb-4">🥗</span>
            <p className="text-gray-600 font-semibold text-[15px]">Cari bahan makanan</p>
            <p className="text-gray-400 text-[13px] mt-1 leading-snug">
              Ketik nama makanan untuk mulai mencatat asupan hari ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DESKTOP — PANEL KANAN (input / summary)
   ════════════════════════════════════════════════════════════ */
function DesktopRight({ view, selectedFood, onAdd, menu, onRemove, totals, target, deficiencies, onBack }) {
  const kkalPct = Math.min(Math.round(totals.kkal / target.kkal * 100), 100);
  const kkalColor = kkalPct >= 90 ? '#22C55E' : kkalPct >= 60 ? '#F97316' : '#EF4444';

  if (view === 'detail' && selectedFood) {
    return (
      <div className="h-full flex flex-col">
        <p className="text-gray-800 font-bold text-[16px] mb-3">Detail Makanan</p>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <FoodDetailInput food={selectedFood} onAdd={onAdd} onBack={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      {/* Total Gizi card */}
      <div>
        <p className="text-gray-800 font-bold text-[16px] mb-3">Total Gizi</p>
        <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-5">
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { emoji:'⚡', bg:'#FFF7CC', label:'Energi',   val:totals.kkal.toFixed(0),    max:target.kkal,    unit:'kkal' },
                { emoji:'💧', bg:'#E0F3FF', label:'Kalium',   val:totals.kalium.toFixed(0), max:target.kalium, unit:'mg'   },
                { emoji:'🍗', bg:'#FFE4EC', label:'Protein',  val:totals.protein.toFixed(0), max:target.protein, unit:'gram' },
                { emoji:'🌿', bg:'#E7F8E7', label:'Zat Besi', val:totals.zatBesi.toFixed(0), max:target.zatBesi, unit:'mg'   },
              ].map((n) => (
                <div key={n.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
                       style={{ backgroundColor: n.bg }}>{n.emoji}</div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">{n.label}</p>
                    <p className="text-[13px] text-gray-800 font-bold leading-tight">
                      {n.val} / {n.max} <span className="text-gray-400 font-normal text-[10px]">{n.unit}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-5 flex-shrink-0">
              <p className="font-bold text-[40px] leading-none" style={{ color: kkalColor }}>
                {Math.round(totals.kkal)}
              </p>
              <p className="text-gray-500 text-[13px] font-medium">kkal</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-4 flex flex-col gap-2.5">
            {[
              { label:'Energi',   val:totals.kkal,    max:target.kkal,    color:'#f2658f' },
              { label:'Protein',  val:totals.protein, max:target.protein, color:'#8B5CF6' },
              { label:'Kalsium',  val:totals.kalsium, max:target.kalsium, color:'#3B82F6' },
              { label:'Zat Besi', val:totals.zatBesi, max:target.zatBesi, color:'#22C55E' },
            ].map((item) => {
              const pct = Math.min(Math.round(item.val / item.max * 100), 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-semibold text-gray-600">{item.label}</span>
                    <span className="text-[11px] text-gray-400">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width:`${pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rekomendasi */}
      <div>
        <p className="text-gray-800 font-bold text-[16px] mb-3">Rekomendasi AI</p>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[80px] pb-16">
          {deficiencies.slice(0, 2).map((def, idx) => (
            def.pct < 80 && (
              <div key={idx} className="flex items-center gap-3 bg-amber-50 rounded-xl px-4 py-3">
                <span className="text-[18px]">{def.emoji}</span>
                <p className="text-amber-800 text-[13px] font-semibold">{def.label} kurang! {def.note}.</p>
              </div>
            )
          ))}
          {kkalPct >= 80 && (
            <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3">
              <span className="text-[18px]">✅</span>
              <p className="text-green-800 text-[13px] font-semibold">Energi dan zat gizi anak hari ini sangat mencukupi, pertahankan!</p>
            </div>
          )}
          {menu.length === 0 && (
            <p className="text-gray-400 text-[13px] text-center py-3">
              Tambahkan makanan untuk melihat rekomendasi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function LogMakanan({ onBack, onNavigate, user }) {
  const [query,        setQuery]        = useState('');
  const [view,         setView]         = useState('search'); // 'search' | 'detail' | 'summary'
  const [selectedFood, setSelectedFood] = useState(null);
  const [menu,         setMenu]         = useState([]);
  const [totals,       setTotals]       = useState({ kkal:0, protein:0, kalsium:0, zatBesi:0, kalium:0 });
  const [deficiencies, setDeficiencies] = useState([]);
  const [allFoods,     setAllFoods]     = useState([]);
  const [meal,         setMeal]         = useState('Sarapan');
  const [activeNav,    setActiveNav]    = useState(2);

  const dateStr = '2026-05-15'; // Default date matching camp figma standard

  const target = user?.akgTargets || {
    kkal: 1125,
    protein: 30,
    kalsium: 850,
    zatBesi: 30,
    kalium: 650,
  };

  const fetchLoggedFoods = async () => {
    try {
      const res = await api.get(`/api/logs?date=${dateStr}`);
      setMenu(res.logs || []);
      setTotals(res.totals || { kkal:0, protein:0, kalsium:0, zatBesi:0, kalium:0 });
      
      const recsRes = await api.get(`/api/recommendations?date=${dateStr}`);
      if (recsRes.data) {
        setDeficiencies(recsRes.data.deficiencies || []);
      }
    } catch (err) {
      console.error('Error fetching logs inside LogMakanan:', err);
    }
  };

  // Load all 1,146 foods once on mount for instant client-side searching
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/api/foods?limit=2000');
        setAllFoods(res || []);
      } catch (err) {
        console.error('Error loading all foods:', err);
      }
    };
    loadData();
    fetchLoggedFoods();
  }, [user]);

  // Client-side instant filtering starting from a single character with absolutely ZERO network requests!
  const results = React.useMemo(() => {
    const term = query.toLowerCase().trim();
    if (term.length < 1) return [];
    return allFoods.filter(f => 
      f.name.toLowerCase().includes(term) || 
      (f.category && f.category.toLowerCase().includes(term))
    ).slice(0, 40); // Top 40 matches for instant premium rendering
  }, [query, allFoods]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (!val) {
      if (menu.length > 0) {
        setView('summary');
      } else {
        setView('search');
      }
    } else {
      if (view !== 'detail') {
        setView('search');
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleToggle = (food) => {
    if (selectedFood?.id === food.id) {
      setSelectedFood(null);
      setView('search');
    } else {
      setSelectedFood(food);
      setView('detail');
    }
  };

  const handleBackToSearch = () => {
    setSelectedFood(null);
    setView('search');
  };

  const handleAdd = async (food, gram) => {
    try {
      await api.post('/api/logs', {
        date: dateStr,
        mealType: meal,
        foodCode: food.id,
        gram: parseFloat(gram)
      });
      
      setSelectedFood(null);
      setQuery('');
      setView('summary');
      await fetchLoggedFoods();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan makanan.');
    }
  };

  const handleRemove = async (logId) => {
    try {
      await api.delete(`/api/logs/${logId}`);
      await fetchLoggedFoods();
      if (menu.length <= 1) setView('search');
    } catch (err) {
      alert(err.message || 'Gagal menghapus makanan.');
    }
  };

  const effectiveView = view === 'summary' || (menu.length > 0 && view === 'search' && !query)
    ? (view === 'detail' ? 'detail' : 'summary')
    : view;

  /* ─────────────────────────────────────────────────────
     MOBILE LAYOUT
   ───────────────────────────────────────────────────── */
  const MobileView = () => (
    <div className="lg:hidden flex flex-col bg-pink-base min-h-screen relative">
      <div className="flex-1 overflow-y-auto pb-32">
        <PageHeader onBack={onBack} />
        <PlanBar meal={meal} onMealChange={setMeal} />

        <div className="mb-3">
          <SearchBar query={query} onChange={handleQueryChange} onClear={() => handleQueryChange('')} onSubmit={handleSearchSubmit} />
        </div>

        {view === 'detail' && selectedFood ? (
          <FoodDetailInput food={selectedFood} onAdd={handleAdd} onBack={handleBackToSearch} />
        ) : effectiveView === 'summary' ? (
          <MenuSummary menu={menu} onRemove={handleRemove} totals={totals} target={target} deficiencies={deficiencies} />
        ) : query && results.length >= 0 ? (
          <div className="bg-white mx-5 rounded-[18px] shadow-sm overflow-hidden border border-gray-100">
            <FoodResultList results={results} selectedId={selectedFood?.id} onToggle={handleToggle} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <span className="text-6xl mb-4">🥗</span>
            <p className="text-gray-600 font-semibold text-[15px]">Mulai catat makanan anak</p>
            <p className="text-gray-400 text-[12px] mt-1 leading-snug">
              Ketik nama bahan makanan di kolom pencarian
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
        <BottomNav active={activeNav} onSelect={(i)=>{setActiveNav(i); if(i!==2) onNavigate?.(i);}} />
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────
     DESKTOP LAYOUT
   ───────────────────────────────────────────────────── */
  const DesktopView = () => (
    <div className="hidden lg:flex flex-col h-screen bg-pink-base overflow-hidden">
      <span className="absolute top-16 left-10 text-[#f2658f]/30 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
      <span className="absolute top-40 right-14 text-[#f2658f]/25 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
      <span className="absolute bottom-28 left-[32%] text-[#f2658f]/30 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
      <span className="absolute bottom-20 right-20 text-[#f2658f]/25 text-lg select-none anim-twinkle-d pointer-events-none">✦</span>

      <div className="flex-shrink-0 px-10 xl:px-14 pt-7 pb-3">
        <div className="flex items-center justify-between mb-1">
          <button onClick={onBack}
            type="button"
            className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium
                       hover:text-[#f2658f] transition-colors">
            <ChevLeft /> Kembali
          </button>
          <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">Log Makanan</h1>
          <button type="button" className="text-gray-400 hover:text-[#f2658f] transition-colors"><PinIcon /></button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-semibold text-[14px]">Daily Nutrition Plan</span>
          {['Sarapan','Cemilan','Makan Siang','Makan Malam'].map((m) => {
            const colors = { 'Sarapan':'#7C6AE8', 'Cemilan':'#34B47E', 'Makan Siang':'#F97316', 'Makan Malam':'#3B82F6' };
            return (
              <button key={m} onClick={() => setMeal(m)}
                type="button"
                className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all
                  ${m === meal ? 'text-white shadow-sm' : 'bg-white/60 text-gray-400 hover:bg-white'}`}
                style={m === meal ? { backgroundColor: colors[m] } : {}}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">
        <div className="w-[48%] xl:w-[46%] h-full flex flex-col pb-6 anim-fade-left anim-d1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-[#f2658f] rounded-xl px-1.5 py-1.5 text-white text-xl shadow-sm">🐟</div>
            <span className="text-[#f2658f] font-bold text-[18px]">NutriSi</span>
          </div>

          <DesktopLeft
            query={query}
            onChange={handleQueryChange}
            onClear={() => handleQueryChange('')}
            onSubmit={handleSearchSubmit}
            view={effectiveView}
            results={results}
            selectedFood={selectedFood}
            onToggle={handleToggle}
            menu={menu}
            onRemove={handleRemove}
          />
        </div>

        <div className="flex-1 h-full flex flex-col pb-6 anim-fade-right anim-d2">
          <DesktopRight
            view={view === 'detail' ? 'detail' : 'summary'}
            selectedFood={selectedFood}
            onAdd={handleAdd}
            menu={menu}
            onRemove={handleRemove}
            totals={totals}
            target={target}
            deficiencies={deficiencies}
            onBack={handleBackToSearch}
          />

          <div className="mt-auto pt-4">
            <BottomNav active={activeNav} onSelect={(i)=>{setActiveNav(i); if(i!==2) onNavigate?.(i);}} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-['Poppins']">
      <MobileView />
      <DesktopView />
    </div>
  );
}
