import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { WeeklyTargetBanner } from '../components/WeeklyTargetBanner';

interface FeatureCard {
  title: string;
  description: string;
}

interface ReadingProgressItem {
  uid: string;
  progress: number;
  updatedAt?: unknown;
}

export function HomePage() {
  const { locale, strings } = useLocale();
  const { user } = useAuth();
  const [featured, setFeatured] = useState<FeatureCard[]>([]);
  const [weeklyProgressCount, setWeeklyProgressCount] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useEffect(() => {
    axios.get('/api/content/home').then((res) => setFeatured(res.data.featured));
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const progressQuery = query(collection(db, 'readingProgress'), where('uid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(progressQuery, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data() as ReadingProgressItem);
      if (!items.length) {
        setWeeklyProgressCount(0);
        setWeeklyAverage(0);
        return;
      }
      const completedItems = items.filter((item) => Number(item.progress || 0) >= 70).length;
      const avg = items.reduce((sum, item) => sum + Number(item.progress || 0), 0) / items.length;
      setWeeklyProgressCount(completedItems);
      setWeeklyAverage(Math.round(avg));
    });

    return () => unsubscribe();
  }, [user?.id]);

  const encouragement = useMemo(() => {
    if (weeklyProgressCount >= 7) return locale === 'ar' ? 'أداء رائع هذا الأسبوع!' : 'Excellent momentum this week!';
    if (weeklyProgressCount >= 3) return locale === 'ar' ? 'استمر، أنت على الطريق الصحيح.' : 'Keep going, you are on track.';
    return locale === 'ar' ? 'ابدأ بهدف بسيط هذا الأسبوع.' : 'Start with a small goal this week.';
  }, [weeklyProgressCount, locale]);

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
          {(Array.isArray(featured) ? featured : []).map((card) => (
            <article key={card.title} className="rounded-3xl border border-sura-ivory/10 bg-black/20 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-sura-gold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-sura-ivory/80">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <WeeklyTargetBanner />

      <section className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{locale === 'ar' ? 'ملخص الأسبوع' : 'Weekly reading summary'}</div>
            <h3 className="mt-2 text-2xl font-semibold">{locale === 'ar' ? 'تقدم القراءة' : 'Reading progress'}</h3>
            <p className="mt-2 text-sm text-sura-ivory/75">{encouragement}</p>
          </div>
          <div className="rounded-2xl border border-sura-ivory/20 bg-black/20 px-5 py-4 text-right">
            <div className="text-xs text-sura-ivory/70">{locale === 'ar' ? 'مواد مكتملة هذا الأسبوع' : 'Completed this week'}</div>
            <div className="text-3xl font-semibold text-sura-gold">{weeklyProgressCount}</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-sura-ivory/70">
            <span>{locale === 'ar' ? 'متوسط التقدم' : 'Average progress'}</span>
            <span>{weeklyAverage}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-sura-ivory/10">
            <div className="h-full rounded-full bg-sura-gold" style={{ width: `${Math.max(0, Math.min(100, weeklyAverage))}%` }} />
          </div>
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
