
import { useState, FormEvent } from 'react';
import { useLocale } from '../context/LocaleContext';

export function ContactPage() {
  const { locale } = useLocale();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setStatus(locale === 'ar' ? 'تم إرسال رسالتك، سنرد قريبًا.' : 'Your message has been sent, we will respond shortly.');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{locale === 'ar' ? 'اتصل بنا' : 'Contact'}</h1>
        <p className="mt-3 text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'سنستجيب خلال 24 ساعة عمل.' : 'Expect a response within one business day.'}</p>
      </header>
      <form onSubmit={submit} className="grid gap-6 rounded-3xl border border-sura-ivory/10 bg-black/30 p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <input value="" placeholder={locale === 'ar' ? 'الاسم' : 'Name'} className="rounded-3xl border border-sura-ivory/20 bg-sura-dark/80 p-4 text-sura-ivory" required />
          <input value="" placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} type="email" className="rounded-3xl border border-sura-ivory/20 bg-sura-dark/80 p-4 text-sura-ivory" required />
        </div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={locale === 'ar' ? 'رسالتك' : 'Your message'} className="min-h-[220px] rounded-3xl border border-sura-ivory/20 bg-sura-dark/80 p-4 text-sura-ivory" required />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="rounded-full bg-sura-gold px-6 py-3 text-sm font-semibold text-sura-dark">{locale === 'ar' ? 'أرسل' : 'Send message'}</button>
          <span className="text-sm text-sura-ivory/70">{locale === 'ar' ? 'متوسط وقت الاستجابة: 24 ساعة' : 'Response time: 24 hours'}</span>
        </div>
        {status && <div className="rounded-3xl bg-sura-gold/10 p-4 text-sm text-sura-ivory">{status}</div>}
      </form>
    </div>
  );
}
