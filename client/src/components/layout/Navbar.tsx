
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
  { path: '/login', key: 'login' }
];

export function Navbar() {
  const { locale, strings, toggle: toggleLocale } = useLocale();
  const { mode, toggle: toggleTheme, fontSize, fontFamilyKey, setFontSize, setFontFamily } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in result:', result);
      const userMetadata = result.user.metadata;
      const isNewUser = userMetadata.creationTime === userMetadata.lastSignInTime;
      navigate(isNewUser ? '/profile' : '/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      const target = e.target as Node;
      if (menuRef.current.contains(target)) return;
      // if click occurs outside menu, close
      setOpen(false);
    }
    if (open) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-sura-border/20 bg-sura-dark/90 backdrop-blur-xl shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-sura-ivory">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sura-gold text-base font-bold text-sura-dark">S</span>
          <div className="hidden min-w-0 flex-col truncate sm:flex">
            <span className="truncate text-base font-semibold">Sura Codex</span>
            <span className="truncate text-xs text-sura-ivory/60">Space for thoughtful reading</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {(Array.isArray(navItems) ? navItems : []).map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `text-sm transition ${isActive ? 'text-sura-gold' : 'text-sura-ivory/60 hover:text-sura-ivory'}`}>
              {strings[item.key] || item.key}
            </NavLink>
          ))}
          {user && <NavLink to="/dashboard" className="text-sm text-sura-ivory/60 transition hover:text-sura-ivory">{strings.dashboard}</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className="text-sm text-sura-ivory/60 transition hover:text-sura-ivory">{strings.admin}</NavLink>}
        </nav>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory outline-none">
              <option value="0.9rem">S</option>
              <option value="1rem">M</option>
              <option value="1.1rem">L</option>
              <option value="1.2rem">XL</option>
            </select>
            <select value={fontFamilyKey} onChange={(e) => setFontFamily(e.target.value)} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory outline-none">
              <option value="inter">Inter</option>
              <option value="georgia">Georgia</option>
              <option value="space">Space</option>
            </select>
            <button onClick={toggleTheme} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory transition hover:border-sura-gold/50 hover:text-sura-ivory">
              {mode === 'dark' ? strings.lightMode : strings.darkMode}
            </button>
            <button onClick={() => toggleLocale()} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory transition hover:border-sura-gold/50 hover:text-sura-ivory">{locale === 'en' ? 'AR' : 'EN'}</button>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <button onClick={handleGoogleLogin} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory transition hover:border-sura-gold/50 hover:text-sura-ivory">
                Sign in with Google
              </button>
            )}

            {user && (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-1 text-sm text-sura-ivory transition hover:border-sura-gold/50"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sura-border/20 text-xs">{user.name?.charAt(0)}</div>
                )}
                <span className="hidden truncate text-sm text-sura-ivory/80 sm:inline">{user.name}</span>
              </button>

              {open && (
                <div ref={menuRef} className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-sura-border/20 bg-sura-ink/95 p-2 shadow-soft">
                  <Link to="/dashboard" className="block rounded px-3 py-2 text-sm text-sura-ivory/80 hover:bg-sura-ink/80">Dashboard</Link>
                  <Link to="/profile" className="block rounded px-3 py-2 text-sm text-sura-ivory/80 hover:bg-sura-ink/80">Profile</Link>
                  <button onClick={logout} className="mt-2 w-full rounded bg-transparent px-3 py-2 text-left text-sm text-sura-ivory/80 hover:bg-sura-ink/80">Sign out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
