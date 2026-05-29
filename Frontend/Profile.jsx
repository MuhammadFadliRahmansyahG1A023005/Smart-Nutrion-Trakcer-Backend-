import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const ChevLeft   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight2 = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const EditIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const BellIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const LangIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const LockIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const HelpIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const CameraIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const StarIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#f2658f"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

/* ── Bottom Nav ── */
function BottomNav({ active = 3, onSelect }) {
  const items = [HomeIcon, ClockIcon, MenuIcon, PersonIcon];
  return (
    <div className="flex justify-center">
      <div className="bg-[#f2658f] rounded-full px-2.5 py-2 flex items-center gap-1.5 shadow-xl">
        {items.map((Icon, i) => (
          <button key={i} onClick={() => onSelect?.(i)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
              ${i === active ? 'bg-white text-[#f2658f] shadow' : 'text-white/90 hover:text-white'}`}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Setting Row ── */
function SettingRow({ icon, label, value, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center justify-between py-3.5 px-1
                  border-b border-gray-50 last:border-0
                  hover:bg-pink-50/30 rounded-xl transition-colors
                  ${danger ? 'text-red-500' : 'text-gray-700'}`}>
      <div className="flex items-center gap-3.5">
        <span className={`${danger ? 'text-red-400' : 'text-[#f2658f]'}`}>{icon}</span>
        <span className="font-semibold text-[14px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-400 text-[12px] font-medium">{value}</span>}
        <span className="text-gray-300"><ChevRight2 /></span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Profile({ onBack, onNavigate, onLogout, onProfileUpdate, user }) {
  const [activeNav, setActiveNav] = useState(3);
  const [notifOn,   setNotifOn]   = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm]   = useState({
    namaAnak: '',
    tanggalLahir: '',
    jenisKelamin: '',
    tinggiBadan: '',
    beratBadan: '',
    alergi: '',
    kondisiKhusus: '',
  });
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    days: 0,
    avgAkg: 0,
    streak: 0
  });

  // Fetch actual data history to compute stats dynamically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const history = await api.get('/api/logs/history');
        if (history && history.length > 0) {
          const days = history.length;
          
          // Calculate average AKG percent
          const targetKkal = user?.akgTargets?.kkal || 1350;
          const sumPct = history.reduce((sum, day) => sum + (day.kkal / targetKkal) * 100, 0);
          const avgAkg = Math.min(100, Math.round(sumPct / days));
          
          // Calculate streak
          let streak = 0;
          const dates = history.map(h => h.date).sort();
          
          let current = new Date();
          while (true) {
            const cStr = current.toISOString().split('T')[0];
            if (dates.includes(cStr)) {
              streak++;
              current.setDate(current.getDate() - 1);
            } else {
              // Also check yesterday to allow streak to continue today
              if (streak === 0) {
                current.setDate(current.getDate() - 1);
                const yStr = current.toISOString().split('T')[0];
                if (dates.includes(yStr)) {
                  streak++;
                  current.setDate(current.getDate() - 1);
                  continue;
                }
              }
              break;
            }
          }
          
          setStats({ days, avgAkg, streak });
        }
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      }
    };
    fetchStats();
  }, [user]);

  // Prefill edit form
  useEffect(() => {
    if (user?.childProfile) {
      setEditForm({
        namaAnak: user.childProfile.namaAnak || '',
        tanggalLahir: user.childProfile.tanggalLahir || '',
        jenisKelamin: user.childProfile.jenisKelamin || 'laki',
        tinggiBadan: user.childProfile.tinggiBadan || '',
        beratBadan: user.childProfile.beratBadan || '',
        alergi: user.childProfile.alergi || '-',
        kondisiKhusus: user.childProfile.kondisiKhusus || '-',
      });
    }
  }, [user, isEditing]);

  // Calculate age dynamically
  const calculateAge = (tanggalLahir) => {
    if (!tanggalLahir) return 'Belum diisi';
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months = 12 + months;
    }
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    if (months < 0) {
      months = 11;
    }
    if (years === 0) {
      return `${months} bulan`;
    }
    return `${years} tahun ${months} bulan`;
  };

  // Analyze nutrition status (BMI percentile approximation)
  const getStatusGizi = (tinggi, berat) => {
    if (!tinggi || !berat) return 'Belum diisi';
    const tM = tinggi / 100;
    const bmi = berat / (tM * tM);
    if (bmi < 13.5) return 'Gizi Kurang ⚠️';
    if (bmi > 18.5) return 'Gizi Lebih ⚠️';
    return 'Normal ✅';
  };

  const getAlergiLabel = (val) => {
    const list = {
      susu: 'Susu',
      telur: 'Telur',
      kacang: 'Kacang',
      seafood: 'Seafood',
      gluten: 'Gluten',
      lainnya: 'Lainnya'
    };
    return list[val] || val || 'Tidak ada';
  };

  const getKondisiLabel = (val) => {
    const list = {
      picky_eater: 'Picky Eater',
      underweight: 'Underweight',
      lactose_intolerant: 'Lactose Intolerant',
      anemia: 'Anemia',
      lainnya: 'Lainnya'
    };
    return list[val] || val || 'Tidak ada';
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        namaAnak: editForm.namaAnak,
        tanggalLahir: editForm.tanggalLahir,
        jenisKelamin: editForm.jenisKelamin,
        tinggiBadan: parseFloat(editForm.tinggiBadan) || 0,
        beratBadan: parseFloat(editForm.beratBadan) || 0,
        alergi: editForm.alergi || '-',
        kondisiKhusus: editForm.kondisiKhusus || '-'
      };
      
      if (!payload.namaAnak || !payload.tanggalLahir || !payload.jenisKelamin) {
        setError('Nama anak, tanggal lahir, dan jenis kelamin wajib diisi.');
        return;
      }

      const res = await api.post('/api/auth/personalize', payload);
      
      const storedUser = JSON.parse(localStorage.getItem('nutrisi_user') || '{}');
      storedUser.childProfile = res.childProfile;
      storedUser.akgTargets = res.akgTargets;
      localStorage.setItem('nutrisi_user', JSON.stringify(storedUser));
      
      onProfileUpdate?.(storedUser);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.');
    }
  };

  /* ── Avatar placeholder SVG ── */
  const AvatarPlaceholder = ({ size = 80 }) => (
    <div className="rounded-full bg-gradient-to-br from-[#f2658f] to-[#f39ab4] flex items-center justify-center flex-shrink-0"
         style={{ width: size, height: size }}>
      <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="white">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  );

  /* ── Child info card ── */
  const ChildCard = ({ compact }) => {
    if (isEditing) {
      return (
        <div className="bg-white rounded-[18px] shadow-sm border border-gray-50 px-5 py-4 w-full">
          <p className="text-gray-700 font-bold text-[14px] mb-3">Edit Profil Anak</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-semibold ml-1">Nama Anak</label>
              <input
                type="text"
                value={editForm.namaAnak}
                onChange={(e) => setEditForm({ ...editForm, namaAnak: e.target.value })}
                className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all"
                placeholder="Nama anak"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={editForm.tanggalLahir}
                  onChange={(e) => setEditForm({ ...editForm, tanggalLahir: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Jenis Kelamin</label>
                <select
                  value={editForm.jenisKelamin}
                  onChange={(e) => setEditForm({ ...editForm, jenisKelamin: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all cursor-pointer"
                >
                  <option value="laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  value={editForm.tinggiBadan}
                  onChange={(e) => setEditForm({ ...editForm, tinggiBadan: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all"
                  placeholder="cm"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Berat Badan (kg)</label>
                <input
                  type="number"
                  value={editForm.beratBadan}
                  onChange={(e) => setEditForm({ ...editForm, beratBadan: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all"
                  placeholder="kg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Alergi</label>
                <select
                  value={editForm.alergi}
                  onChange={(e) => setEditForm({ ...editForm, alergi: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all cursor-pointer"
                >
                  <option value="-">Tidak ada</option>
                  <option value="susu">Susu</option>
                  <option value="telur">Telur</option>
                  <option value="kacang">Kacang</option>
                  <option value="seafood">Seafood</option>
                  <option value="gluten">Gluten</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-semibold ml-1">Kondisi Khusus</label>
                <select
                  value={editForm.kondisiKhusus}
                  onChange={(e) => setEditForm({ ...editForm, kondisiKhusus: e.target.value })}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2658f] transition-all cursor-pointer"
                >
                  <option value="-">Tidak ada</option>
                  <option value="picky_eater">Picky Eater</option>
                  <option value="underweight">Underweight</option>
                  <option value="lactose_intolerant">Lactose Intolerant</option>
                  <option value="anemia">Anemia</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-semibold text-center mt-1">{error}</p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 h-[32px] rounded-full border border-gray-200 text-gray-500 font-semibold text-[11px] hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 h-[32px] rounded-full bg-[#f2658f] text-white font-semibold text-[11px] hover:bg-[#d94876] transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-[18px] shadow-sm border border-gray-50 w-full
                       ${compact ? 'px-5 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 font-bold text-[14px]">Info Anak</p>
          <button onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-[#f2658f] text-[12px] font-semibold
                             hover:underline transition-colors">
            <EditIcon /> Edit
          </button>
        </div>
        <div className={`grid grid-cols-2 ${compact ? 'gap-3' : 'gap-4'}`}>
          {[
            { label:'Nama',          val: user?.childProfile?.namaAnak || 'Belum diisi' },
            { label:'Usia',          val: calculateAge(user?.childProfile?.tanggalLahir) },
            { label:'Jenis Kelamin', val: user?.childProfile?.jenisKelamin === 'laki' ? 'Laki-laki' : user?.childProfile?.jenisKelamin === 'perempuan' ? 'Perempuan' : 'Belum diisi' },
            { label:'Tinggi Badan',  val: user?.childProfile?.tinggiBadan ? `${user.childProfile.tinggiBadan} cm` : 'Belum diisi' },
            { label:'Berat Badan',   val: user?.childProfile?.beratBadan ? `${user.childProfile.beratBadan} kg` : 'Belum diisi' },
            { label:'Status Gizi',   val: getStatusGizi(user?.childProfile?.tinggiBadan, user?.childProfile?.beratBadan) },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-gray-400 text-[11px] font-medium">{label}</p>
              <p className="text-gray-800 font-semibold text-[13px] mt-0.5">{val}</p>
            </div>
          ))}
        </div>

        {/* Alergi & kondisi */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-gray-400 text-[11px] font-medium mb-1.5">Alergi</p>
          <div className="flex flex-wrap gap-1.5">
            {user?.childProfile?.alergi && user.childProfile.alergi !== '-' ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#fce4ec] text-[#f2658f]">
                {getAlergiLabel(user.childProfile.alergi)}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-gray-400 italic">Tidak ada</span>
            )}
          </div>
        </div>
        <div className="mt-2.5">
          <p className="text-gray-400 text-[11px] font-medium mb-1.5">Kondisi Khusus</p>
          <div className="flex flex-wrap gap-1.5">
            {user?.childProfile?.kondisiKhusus && user.childProfile.kondisiKhusus !== '-' ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F5F3FF] text-[#8B5CF6]">
                {getKondisiLabel(user.childProfile.kondisiKhusus)}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-gray-400 italic">Tidak ada</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Stats row ── */
  const StatsRow = () => (
    <div className="grid grid-cols-3 gap-2.5 w-full">
      {[
        { val: stats.days.toString(), label: 'Hari Tercatat', color: '#f2658f', bg: '#fce4ec' },
        { val: `${stats.avgAkg}%`, label: 'Rata-rata AKG', color: '#22C55E', bg: '#F0FDF4' },
        { val: stats.streak.toString(), label: 'Hari Streak 🔥', color: '#F97316', bg: '#FFF7ED' },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-[14px] px-3 py-3 text-center shadow-sm border border-gray-50">
          <p className="font-bold text-[20px] leading-none" style={{ color: s.color }}>{s.val}</p>
          <p className="text-gray-400 text-[10px] font-medium mt-1 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );

  /* ── Settings list ── */
  const SettingsList = () => (
    <div className="bg-white rounded-[18px] px-4 py-2 shadow-sm border border-gray-50 w-full">
      <SettingRow icon={<BellIcon />} label="Notifikasi"
        value={notifOn ? 'Aktif' : 'Nonaktif'}
        onClick={() => setNotifOn((v) => !v)} />
      <SettingRow icon={<LangIcon />} label="Bahasa" value="Bahasa Indonesia" />
      <SettingRow icon={<LockIcon />} label="Privasi & Keamanan" />
      <SettingRow icon={<HelpIcon />} label="Bantuan & FAQ" />
    </div>
  );

  /* ── Logout ── */
  const LogoutBtn = () => (
    <div className="bg-white rounded-[18px] px-4 py-2 shadow-sm border border-gray-50 w-full">
      <SettingRow icon={<LogoutIcon />} label="Keluar" danger
        onClick={() => onLogout?.()} />
    </div>
  );

  /* ── App version ── */
  const AppVer = () => (
    <p className="text-center text-gray-300 text-[11px] font-medium mt-2">
      NutriSi v1.0.0 · Made with ❤️ for kids
    </p>
  );

  /* ═══════════════ MOBILE ═══════════════ */
  const MobileView = () => (
    <div className="lg:hidden flex flex-col bg-pink-base min-h-screen">
      <div className="flex-1 overflow-y-auto pb-32">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <button onClick={onBack}
            className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
            <ChevLeft /> Kembali
          </button>
          <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Profile</h1>
          <div className="w-16" />
        </div>

        {/* Avatar section */}
        <div className="flex flex-col items-center pb-5 pt-2 anim-fade-up anim-d0">
          {/* Avatar ring */}
          <div className="relative mb-3">
            <div className="w-[88px] h-[88px] rounded-full p-[3px]
                            bg-gradient-to-br from-[#f2658f] to-[#f39ab4] shadow-lg">
              <AvatarPlaceholder size={82} />
            </div>
            {/* Camera button */}
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#f2658f]
                               flex items-center justify-center shadow-md
                               hover:bg-[#d94876] transition-colors">
              <CameraIcon />
            </button>
          </div>

          {/* Nama & rating */}
          <p className="text-gray-800 font-bold text-[18px] leading-tight">{user?.childProfile?.namaAnak || 'Anak'}</p>
          <p className="text-gray-400 text-[13px] mt-0.5">Orang tua: {user?.username || 'Orang Tua'}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {[1,2,3,4,5].map((s) => <StarIcon key={s} />)}
            <span className="text-gray-400 text-[11px] ml-1 font-medium">Status gizi: {getStatusGizi(user?.childProfile?.tinggiBadan, user?.childProfile?.beratBadan)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 flex flex-col gap-3 items-center anim-fade-up anim-d1">
          <StatsRow />
          <ChildCard />
          <SettingsList />
          <LogoutBtn />
          <AppVer />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
        <BottomNav active={activeNav}
          onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
      </div>
    </div>
  );

  /* ═══════════════ DESKTOP ═══════════════ */
  const DesktopView = () => (
    <div className="hidden lg:flex flex-col h-screen bg-pink-base overflow-hidden">

      {/* Stars */}
      <span className="absolute top-14 left-10  text-[#f2658f]/30 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
      <span className="absolute top-40 right-14 text-[#f2658f]/25 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
      <span className="absolute bottom-24 left-[34%] text-[#f2658f]/30 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
      <span className="absolute bottom-20 right-20  text-[#f2658f]/25 text-lg select-none anim-twinkle-d pointer-events-none">✦</span>

      {/* Top bar */}
      <div className="flex-shrink-0 px-10 xl:px-14 pt-7 pb-4 flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
          <ChevLeft /> Kembali
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#f2658f] rounded-xl px-1.5 py-1.5 text-white text-xl shadow-sm">🐟</div>
            <span className="text-[#f2658f] font-bold text-[18px]">NutriSi</span>
          </div>
          <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">— Profile</h1>
        </div>
        <div className="w-20" />
      </div>

      {/* Body: two columns */}
      <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">

        {/* KIRI: Avatar + ChildCard */}
        <div className="w-[42%] xl:w-[38%] h-full flex flex-col pb-6 gap-4 overflow-y-auto anim-fade-left anim-d1 no-scrollbar">

          {/* Profile card */}
          <div className="bg-white rounded-[22px] px-6 py-6 shadow-sm border border-gray-50 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-[100px] h-[100px] rounded-full p-[3px]
                              bg-gradient-to-br from-[#f2658f] to-[#f39ab4] shadow-lg">
                <AvatarPlaceholder size={94} />
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#f2658f]
                                 flex items-center justify-center shadow-md hover:bg-[#d94876] transition-colors">
                <CameraIcon />
              </button>
            </div>

            <p className="text-gray-800 font-bold text-[20px]">{user?.childProfile?.namaAnak || 'Anak'}</p>
            <p className="text-gray-400 text-[13px] mt-0.5">Orang tua: {user?.username || 'Orang Tua'}</p>
            <div className="flex items-center gap-1 mt-2 mb-4">
              {[1,2,3,4,5].map((s) => <StarIcon key={s} />)}
              <span className="text-gray-400 text-[11px] ml-1 font-medium">{getStatusGizi(user?.childProfile?.tinggiBadan, user?.childProfile?.beratBadan)}</span>
            </div>

            {/* Stats horizontal */}
            <div className="flex w-full gap-2">
              {[
                { val: stats.days.toString(), label: 'Hari', color: '#f2658f', bg: '#fce4ec' },
                { val: `${stats.avgAkg}%`, label: 'AKG', color: '#22C55E', bg: '#F0FDF4' },
                { val: `${stats.streak}🔥`, label: 'Streak', color: '#F97316', bg: '#FFF7ED' },
              ].map((s) => (
                <div key={s.label} className="flex-1 rounded-[12px] px-2 py-2.5 text-center"
                     style={{ backgroundColor: s.bg }}>
                  <p className="font-bold text-[18px] leading-none" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-gray-400 text-[10px] font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Child info card */}
          <ChildCard compact />
        </div>

        {/* KANAN: Settings + Logout */}
        <div className="flex-1 h-full flex flex-col gap-4 pb-6 overflow-y-auto anim-fade-right anim-d2 no-scrollbar">

          {/* Pengaturan akun */}
          <div>
            <p className="text-gray-700 font-bold text-[15px] mb-2.5 px-1">Pengaturan</p>
            <SettingsList />
          </div>

          {/* Bantuan */}
          <div>
            <p className="text-gray-700 font-bold text-[15px] mb-2.5 px-1">Lainnya</p>
            <LogoutBtn />
          </div>

          <AppVer />

          {/* Bottom nav */}
          <div className="mt-auto">
            <BottomNav active={activeNav}
              onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
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
