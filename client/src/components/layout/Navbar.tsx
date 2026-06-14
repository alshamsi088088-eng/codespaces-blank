import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { path: '/', key: 'home' },
  { path: '/articles', key: 'articles' },
  { path: '/novels', key: 'novels' },
  { path: '/gallery', key: 'gallery' },
  { path: '/store', key: 'store' },
  { path: '/tech', key: 'tech' },
  { path: '/about', key: 'about' },
];

export function Navbar() {
  const { locale, strings, toggle: toggleLocale } = useLocale();
  const { mode, toggle: toggleTheme, fontSize, fontFamilyKey, setFontSize, setFontFamily } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isLight = mode !== 'dark';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      navigate(isNewUser ? '/profile' : '/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const c = {
    bg: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(21,33,44,0.92)',
    border: isLight ? '#E7E2DC' : 'rgba(200,217,230,0.12)',
    navy: isLight ? '#2F4156' : '#F5EFEB',
    teal: isLight ? '#567C8D' : '#C8D9E6',
    muted: isLight ? 'rgba(32,48,63,0.55)' : 'rgba(245,239,235,0.6)',
    card: isLight ? '#FFFFFF' : '#1c2c3a',
    canvas: isLight ? '#FAF9F7' : 'rgba(200,217,230,0.06)',
    pill: isLight ? 'rgba(86,124,141,0.10)' : 'rgba(200,217,230,0.1)',
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: c.bg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${c.border}`,
    }} dir={dir}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.card,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src="/logo.svg" alt="Sura Codex" style={{ width: 30, height: 30 }} />
          </div>
          <div style={{ display: 'none' }} className="sm-show">
            <div style={{ color: c.navy, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, lineHeight: 1.15, letterSpacing: '0.01em' }}>
              {locale === 'ar' ? 'سُرى كودكس' : 'The Sura Codex'}
            </div>
            <div style={{ color: c.muted, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {locale === 'ar' ? 'تقاطع الكود والأدب' : 'Code & Literature'}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                padding: '8px 16px', borderRadius: 999, fontSize: 13.5, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.01em',
                background: isActive ? c.pill : 'transparent',
                color: isActive ? c.navy : c.muted,
              })}>
              {strings[item.key] || item.key}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/dashboard"
              style={({ isActive }) => ({
                padding: '8px 16px', borderRadius: 999, fontSize: 13.5, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                background: isActive ? c.pill : 'transparent',
                color: isActive ? c.navy : c.muted,
              })}>
              {strings.dashboard}
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin"
              style={({ isActive }) => ({
                padding: '8px 16px', borderRadius: 999, fontSize: 13.5, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                background: isActive ? c.pill : 'transparent',
                color: isActive ? c.navy : c.muted,
              })}>
              {strings.admin}
            </NavLink>
          )}
        </nav>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 999, border: `1px solid ${c.border}`, background: c.canvas, color: c.navy, fontSize: 12.5, cursor: 'pointer' }}>
            <option value="0.9rem">S</option>
            <option value="1rem">M</option>
            <option value="1.1rem">L</option>
            <option value="1.2rem">XL</option>
          </select>

          <select value={fontFamilyKey} onChange={(e) => setFontFamily(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 999, border: `1px solid ${c.border}`, background: c.canvas, color: c.navy, fontSize: 12.5, cursor: 'pointer' }}>
            <option value="inter">Inter</option>
            <option value="georgia">Georgia</option>
            <option value="space">Space</option>
          </select>

          <button onClick={toggleTheme}
            style={{ padding: '7px 13px', borderRadius: 999, border: `1px solid ${c.border}`, background: c.canvas, color: c.navy, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
            {mode === 'dark' ? '☀' : '☾'}
          </button>

          <button onClick={() => toggleLocale()}
            style={{ padding: '7px 14px', borderRadius: 999, border: `1px solid ${c.border}`, background: c.canvas, color: c.navy, fontSize: 12.5, cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em' }}>
            {locale === 'en' ? 'AR' : 'EN'}
          </button>

          {!user && (
            <button onClick={handleGoogleLogin}
              style={{
                padding: '9px 20px', borderRadius: 999, border: `1px solid ${c.navy}`,
                background: c.navy,
                color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600,
              }}>
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
            </button>
          )}

          {user && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button onClick={() => setOpen((v) => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 5px 5px 14px', borderRadius: 999, border: `1px solid ${c.border}`, background: c.canvas, cursor: 'pointer' }}>
                <span style={{ color: c.navy, fontSize: 13, fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>{user.name?.charAt(0)}</div>
                }
              </button>

              {open && (
                <div style={{
                  position: 'absolute', [locale === 'ar' ? 'left' : 'right']: 0, top: 'calc(100% + 8px)',
                  width: 180, background: c.card, border: `1px solid ${c.border}`,
                  borderRadius: 16, padding: 8, boxShadow: '0 16px 40px rgba(32,48,63,0.12)',
                }}>
                  <Link to="/dashboard" onClick={() => setOpen(false)} style={{ display: 'block', padding: '9px 14px', color: c.navy, textDecoration: 'none', fontSize: 14, borderRadius: 10, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.canvas)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </Link>
                  <Link to="/profile" onClick={() => setOpen(false)} style={{ display: 'block', padding: '9px 14px', color: c.navy, textDecoration: 'none', fontSize: 14, borderRadius: 10, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.canvas)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </Link>
                  <div style={{ height: 1, background: c.border, margin: '6px 0' }} />
                  <button onClick={() => { logout(); setOpen(false); }}
                    style={{ width: '100%', textAlign: locale === 'ar' ? 'right' : 'left', padding: '9px 14px', color: '#b3514f', background: 'transparent', border: 'none', fontSize: 14, borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(179,81,79,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {locale === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
