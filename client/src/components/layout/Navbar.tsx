
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
    <header className="sticky top-0 z-50 border-b border-sura-ivory/10 bg-sura-dark/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-wide text-sura-ivory">
          <span className="rounded-full bg-sura-gold px-3 py-2 text-sura-dark">S</span>
          <div>
            <div>Sura Codex</div>
            <div className="text-xs text-sura-ivory/70">مساحة للفكر والإبداع</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 md:flex">
          {(Array.isArray(navItems) ? navItems : []).map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-sura-ivory/10 text-sura-gold' : 'text-sura-ivory/70 hover:text-sura-ivory'}`}>
              {strings[item.key] || item.key}
            </NavLink>
          ))}
          {user && <NavLink to="/dashboard" className="rounded-full px-3 py-2 text-sm text-sura-ivory/70 hover:text-sura-ivory">{strings.dashboard}</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className="rounded-full px-3 py-2 text-sm text-sura-ivory/70 hover:text-sura-ivory">{strings.admin}</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-full border border-sura-ivory/20 px-3 py-2 text-sm transition hover:border-sura-gold/60">
            {mode === 'dark' ? strings.lightMode : strings.darkMode}
          </button>
          <button onClick={() => toggle()} className="rounded-full border border-sura-ivory/20 px-3 py-2 text-sm transition hover:border-sura-gold/60">{locale === 'en' ? 'AR' : 'EN'}</button>
        </div>
      </div>
    </header>
  );
}
