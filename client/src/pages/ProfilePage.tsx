import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export function ProfilePage() {
  const { user, loading } = useAuth();
  const { locale } = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="mx-auto max-w-4xl rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8 text-center text-sura-ivory">{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading profile...'}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">{locale === 'ar' ? 'الملف الشخصي' : 'Your Profile'}</h1>
        <p className="text-sura-ivory/70">{locale === 'ar' ? 'عرض معلومات حسابك وتفاصيل تسجيل الدخول.' : 'View your account details and Firebase profile information.'}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-[200px_1fr] items-start">
        <div className="rounded-3xl border border-sura-border/30 bg-sura-dark/80 p-5 text-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" />
          ) : (
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-sura-border/20 text-4xl text-sura-ivory/80">{user.name?.charAt(0)}</div>
          )}
          <div className="rounded-3xl bg-sura-ink/90 px-4 py-3 text-left text-sm text-sura-ivory/80">
            <div className="mb-2 font-semibold text-sura-gold">{locale === 'ar' ? 'الاسم' : 'Display Name'}</div>
            <div>{user.name}</div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-sura-border/20 bg-sura-dark/80 p-6">
          <div className="rounded-3xl bg-sura-ink/90 p-5 text-left text-sura-ivory/80">
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-sura-gold">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</div>
            <div>{user.email}</div>
          </div>
          <div className="rounded-3xl bg-sura-ink/90 p-5 text-left text-sura-ivory/80">
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-sura-gold">{locale === 'ar' ? 'الدور' : 'Role'}</div>
            <div>{user.role}</div>
          </div>
          <div className="rounded-3xl bg-sura-ink/90 p-5 text-left text-sura-ivory/80">
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-sura-gold">{locale === 'ar' ? 'النظام' : 'Theme'}</div>
            <div>{user.theme}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
