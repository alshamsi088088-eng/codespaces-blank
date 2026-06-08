
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export function LoginPage() {
  const { login } = useAuth();
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(locale === 'ar' ? 'يرجى التحقق من بيانات الحساب.' : 'Please check your login details.');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
      <h1 className="text-3xl font-semibold">{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} className="w-full rounded-3xl border border-sura-ivory/20 bg-sura-dark/80 px-4 py-3 text-sura-ivory" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'} className="w-full rounded-3xl border border-sura-ivory/20 bg-sura-dark/80 px-4 py-3 text-sura-ivory" required />
        <button type="submit" className="w-full rounded-full bg-sura-gold px-4 py-3 text-sm font-semibold text-sura-dark">{locale === 'ar' ? 'دخول' : 'Log in'}</button>
      </form>
      {error && <div className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      <div className="space-y-3 text-center text-sm text-sura-ivory/70">
        <p>{locale === 'ar' ? 'أو تابع مع' : 'Or continue with'}</p>
        <div className="flex items-center justify-center gap-3">
          <a href="/api/auth/google" className="rounded-full border border-sura-ivory/20 px-4 py-3 text-sm">Google</a>
          <a href="/api/auth/apple" className="rounded-full border border-sura-ivory/20 px-4 py-3 text-sm">Apple</a>
        </div>
      </div>
    </div>
  );
}
