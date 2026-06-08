
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AdminPage() {
  const { locale } = useLocale();
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/admin/overview').then((res) => setOverview(res.data));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{locale === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</h1>
        <p className="mt-3 text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'إحصائيات سريعة حول المستخدمين والمحتوى والإيرادات.' : 'Quick insight into users, content, revenue, and reader activity.'}</p>
      </header>
      {overview && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-sura-gold">Users</div>
            <div className="mt-4 text-4xl font-semibold">{overview.users}</div>
            <div className="mt-2 text-sm text-sura-ivory/70">Active readers, writers, and admins</div>
          </div>
          <div className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-sura-gold">Revenue</div>
            <div className="mt-4 text-4xl font-semibold">${overview.revenue}</div>
            <div className="mt-2 text-sm text-sura-ivory/70">Stripe orders and digital sales</div>
          </div>
        </div>
      )}
      <section className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-6">
        <div className="text-sm uppercase tracking-[0.3em] text-sura-gold">Traffic</div>
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overview?.traffic || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#ddd" />
              <YAxis stroke="#ddd" />
              <Tooltip contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#333' }} />
              <Line type="monotone" dataKey="visitors" stroke="#c9a84c" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
