
import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface FeatureCard {
  title: string;
  description: string;
}

export function HomePage() {
  const { locale, strings } = useLocale();
  const { user } = useAuth();
  const [featured, setFeatured] = useState<FeatureCard[]>([]);

  useEffect(() => {
    axios.get('/api/content/home').then((res) => setFeatured(res.data.featured));
  }, []);

  const heroTitle = locale === 'ar' ? 'مساحة للفكر والإبداع' : 'A Space for Thought & Creativity';
  const heroSubtitle = locale === 'ar' ? 'منصة نشر راقية للأدب والمعرفة والثقافة الرقمية.' : 'A refined publishing platform for literature, knowledge, and digital culture.';

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <section className="grid gap-10 rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8 shadow-lg shadow-black/20 sm:p-12">
        <div className="space-y-6 text-center sm:text-left">
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="max-w-3xl text-lg leading-8 text-sura-ivory/80">
            {heroSubtitle}
          </motion.p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#articles" className="rounded-full bg-sura-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-sura-dark transition hover:bg-sura-ivory/90">
              {locale === 'ar' ? 'ابدأ القراءة' : 'Start reading'}
            </a>
            <a href="/about" className="rounded-full border border-sura-ivory/20 px-6 py-3 text-sm transition hover:border-sura-gold/60">
              {locale === 'ar' ? 'اعرف أكثر' : 'Learn more'}
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((card) => (
            <article key={card.title} className="rounded-3xl border border-sura-ivory/10 bg-black/20 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-sura-gold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-sura-ivory/80">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="articles" className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{strings.featured}</div>
          <h2 className="mt-4 text-3xl font-semibold">{locale === 'ar' ? 'منشورات مختارة' : 'Featured stories'}</h2>
          <p className="mt-4 text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'التقاليد الفنية والمعرفة في مكان واحد.' : 'A rotation of carefully curated essays and stories.'}</p>
        </article>
        <article className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{strings.latest}</div>
          <h2 className="mt-4 text-3xl font-semibold">{locale === 'ar' ? 'المقالات الأحدث' : 'Latest articles'}</h2>
          <p className="mt-4 text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'تابع التدفق اليومي للمحتوى الأدبي والمعرفي.' : 'Discover the newest essays, notes, and author moments.'}</p>
        </article>
        <article className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{strings.editorPick}</div>
          <h2 className="mt-4 text-3xl font-semibold">{locale === 'ar' ? 'اختيارات المحرر' : "Editor's picks"}</h2>
          <p className="mt-4 text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'اقرأ أفضل ما اختاره فريقنا هذا الأسبوع.' : 'Handpicked reads for slow, thoughtful attention.'}</p>
        </article>
      </section>
      <section className="grid gap-6 rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-sura-gold">{locale === 'ar' ? 'بصمة المؤلف' : 'Author spotlight'}</div>
            <h3 className="mt-2 text-3xl font-semibold">{locale === 'ar' ? 'نجم الأسبوع' : 'Writer of the week'}</h3>
          </div>
          <div className="rounded-full border border-sura-ivory/20 px-4 py-2 text-sm text-sura-ivory/80">{user ? `${user.name}` : locale === 'ar' ? 'زائر كريم' : 'Guest reader'}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-black/30 p-6">
            <h4 className="font-semibold">{locale === 'ar' ? 'قصة جديدة' : 'New release'}</h4>
            <p className="mt-3 text-sm text-sura-ivory/80">{locale === 'ar' ? 'رواية مترجمة إلى العربية تجذب القارئ المُنتبه.' : 'A new novel chapter designed for midnight reading.'}</p>
          </div>
          <div className="rounded-3xl bg-black/30 p-6">
            <h4 className="font-semibold">{locale === 'ar' ? 'قائمة القراءة' : 'Reading streak'}</h4>
            <p className="mt-3 text-sm text-sura-ivory/80">{locale === 'ar' ? 'سبعة أيام من محتوى متواصل يمنحك تألقًا.' : 'Track your daily reading and keep the rhythm alive.'}</p>
          </div>
          <div className="rounded-3xl bg-black/30 p-6">
            <h4 className="font-semibold">{locale === 'ar' ? 'صوت محيط' : 'Ambient audio'}</h4>
            <p className="mt-3 text-sm text-sura-ivory/80">{locale === 'ar' ? 'موسيقى خفيفة أجواء مقهى لتغليف تجربة القراءة.' : 'Rain, café, and library soundscapes for focus.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
