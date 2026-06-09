
import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
  const { locale, strings, toggle } = useLocale();
  const { mode } = useTheme();
  const { user } = useAuth();

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
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory transition hover:border-sura-gold/50 hover:text-sura-ivory">
            {mode === 'dark' ? strings.lightMode : strings.darkMode}
          </button>
          <button onClick={() => toggle()} className="rounded-full border border-sura-border/30 bg-sura-ink/80 px-3 py-2 text-sm text-sura-ivory transition hover:border-sura-gold/50 hover:text-sura-ivory">{locale === 'en' ? 'AR' : 'EN'}</button>
        </div>
      </div>
    </header>
  );
}
