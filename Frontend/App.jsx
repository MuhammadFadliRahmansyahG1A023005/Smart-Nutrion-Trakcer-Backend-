
import React, { useState, useCallback, useEffect } from 'react';
import Onboarding      from './pages/Onboarding';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Personalisasi   from './pages/Personalisasi';
import Home            from './pages/Home';
import LogMakanan      from './pages/LogMakanan';
import Riwayat         from './pages/Riwayat';
import Profile         from './pages/Profile';
import LupaSandi       from './pages/LupaSandi';
import DetailAKG       from './pages/DetailAKG';
import Rekomendasi     from './pages/Rekomendasi';
import LoadingErrorDemo, { LoadingScreen } from './pages/LoadingError';
import { api } from './utils/api';

/* Peta tab index bottom nav → halaman */
const NAV_MAP = { 0:'home', 1:'riwayat', 2:'logMakanan', 3:'profile' };

function App() {
  const [page, setPage]       = useState('loading');
  const [loading, setLoading] = useState(false);
  const [user, setUser]       = useState(null);

  // Restore session on mount
  useEffect(() => {
    const token = api.getToken();
    const storedUser = localStorage.getItem('nutrisi_user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.childProfile) {
          setPage('home');
        } else {
          setPage('personalisasi');
        }
      } catch (e) {
        api.clearToken();
        setPage('onboarding');
      }
    } else {
      setPage('onboarding');
    }
  }, []);

  /* Navigasi dengan transisi loading singkat */
  const go = useCallback((target, fast = true) => {
    if (target === page) return;
    if (fast) { setPage(target); return; }
    setLoading(true);
    setTimeout(() => { setPage(target); setLoading(false); }, 700);
  }, [page]);

  const goNav = (i) => go(NAV_MAP[i] ?? 'home', true);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.childProfile) {
      go('home');
    } else {
      go('personalisasi');
    }
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    go('personalisasi');
  };

  const handlePersonalizationComplete = (updatedUser) => {
    setUser(updatedUser);
    go('home');
  };

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    go('login', true);
  };

  if (page === 'loading' || loading) return <LoadingScreen />;

  return (
    <div>
      {page === 'onboarding'   && <Onboarding    onMulai={() => go('login', true)} />}
      {page === 'login'        && <Login          onKeRegister={() => go('register', true)}
                                                  onLupaSandi={() => go('lupaSandi', true)}
                                                  onLoginSuccess={handleLoginSuccess} />}
      {page === 'register'     && <Register       onKeLogin={() => go('login', true)}
                                                  onRegisterSuccess={handleRegisterSuccess} />}
      {page === 'personalisasi'&& <Personalisasi  onSelesai={handlePersonalizationComplete} />}

      {page === 'home'         && <Home           onLogMakanan={() => go('logMakanan')}
                                                  onDetailAKG={() => go('detailAKG')}
                                                  onRekomendasi={() => go('rekomendasi')}
                                                  onNavigate={goNav}
                                                  user={user} />}

      {page === 'logMakanan'   && <LogMakanan     onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  user={user} />}
      {page === 'riwayat'      && <Riwayat        onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  user={user} />}
      {page === 'profile'      && <Profile        onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  onLogout={handleLogout}
                                                  onProfileUpdate={(updatedUser) => setUser(updatedUser)}
                                                  user={user} />}

      {page === 'lupaSandi'    && <LupaSandi      onBack={() => go('login', true)}
                                                  onKeLogin={() => go('login', true)} />}
      {page === 'detailAKG'    && <DetailAKG      onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  user={user} />}
      {page === 'rekomendasi'  && <Rekomendasi    onBack={() => go('home', true)}
                                                  onNavigate={goNav}
                                                  user={user} />}
      {page === 'stateDemo'    && <LoadingErrorDemo onBack={() => go('home', true)} />}
    </div>
  );
}

export default App;
